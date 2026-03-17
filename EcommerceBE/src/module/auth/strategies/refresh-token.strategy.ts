
import { PassportStrategy } from '@nestjs/passport';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from 'passport-jwt';
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
    Strategy,
    'jwt-refresh',
) {
    constructor(
        private prisma: PrismaService,
        private configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
            passReqToCallback: true,
        } as StrategyOptionsWithRequest);
    }

    async validate(req: Request, payload: { sub: string; email: string }) {
        console.log('RequestTokenStrategy.validate called');
        console.log('Payload', { sub: payload.sub, email: payload.email });

        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new UnauthorizedException('Invalid authentication header');
        }
        const refreshToken = authHeader.replace('Bearer ', '').trim();
        if (!refreshToken) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.sub,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                password: false,
                refreshToken: true,
            },
        });

        if (!user || !user.refreshToken) {
            throw new UnauthorizedException('User not found');
        }

        const refreshTokenMatches = await bcrypt.compare(
            refreshToken,
            user.refreshToken,
        );

        if (!refreshTokenMatches) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        return { id: user.id, email: user.email, role: user.role };
    }
}
