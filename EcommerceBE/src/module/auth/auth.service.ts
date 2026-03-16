import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { AuthResponserDto } from './dto/auth-response.dto';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    private readonly SALT_ROUNDS = 12;
    constructor(private prisma: PrismaService, private jwtService: JwtService) { }

    async register(registerDto: RegisterDto): Promise<AuthResponserDto> {
        const { email, password, firstName, lastName } = registerDto;

        const existingUser = await this.prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (existingUser) {
            throw new ConflictException('User already exists');
        }

        try {
            const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS)
            const user = await this.prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    firstName,
                    lastName,
                    provider: "LOCAL"
                },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    provider: true,
                    role: true,
                    password: false
                },
            });

            const token = await this.generateToken(user.id, user.email);

            await this.updateRefreshToken(user.id, user.email);
            return {
                ...token,
                user,
            };
        }
        catch (error) {
            console.error('Error during user registration:', error);
            throw new InternalServerErrorException('An error occurred during registration')
        }

    }

    private async generateToken(userId: string, email: string):
        Promise<{ accessToken: string; refreshToken: string }> {
        const payload = { sub: userId, email };
        const refreshId = randomBytes(16).toString('hex');
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                expiresIn: '15m',
            }),
            this.jwtService.signAsync({ ...payload, refreshId }, {
                expiresIn: '7d',
            }),
        ]);

        return { accessToken, refreshToken };
    }

    async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken },
        });
    }

    async refreshTokens(userId: string): Promise<AuthResponserDto> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                password: false,
            },
        });
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        const tokens = await this.generateToken(user.id, user.email);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return {
            ...tokens,
            user,
        };
    }

    async login(loginDto: LoginDto): Promise<AuthResponserDto> {
        const { email, password } = loginDto;

        const user = await this.prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                password: true,
            },
        });
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const token = await this.generateToken(user.id, user.email);
        await this.updateRefreshToken(user.id, token.refreshToken);

        return{
            ...token,
            user:{
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            }
        }

    }

    async logout(userId: string): Promise<void> {
        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: null }
        })
    }
}
