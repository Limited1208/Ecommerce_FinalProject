import { Body, Controller, HttpCode, HttpStatus, Patch, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { AuthResponserDto } from './dto/auth-response.dto';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.decorator';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RoleGuard } from './guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {

    }

    @Post('register')
    @HttpCode(201)
    @ApiOperation({
        summary: 'Register a new user',
        description: 'Register a new user',
    })
    @ApiResponse({
        status: 201,
        description: 'User registered successfully',
        type: AuthResponserDto,
    })
    @ApiResponse({ status: 400, description: 'Bad request', type: String })
    @ApiResponse({
        status: 500,
        description: 'Internal server error',
        type: String,
    })
    @ApiResponse({ status: 429, description: 'Too many requests', type: String })
    async register(@Body() registerDto: RegisterDto): Promise<AuthResponserDto> {
        return this.authService.register(registerDto)
    }

    @Post('refreshToken')
    @HttpCode(HttpStatus.OK)
    @UseGuards(RefreshTokenGuard)
    async refresh(@GetUser('id') userId: string): Promise<AuthResponserDto> {
        return await this.authService.refreshTokens(userId)
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async logout(@GetUser('id') userId: string): Promise<{ message: string }> {
        this.authService.logout(userId);
        return { message: 'Successfully logged out' };
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto): Promise<AuthResponserDto> {
        return this.authService.login(loginDto);
    }

    @Post('/admin/login')
    @HttpCode(HttpStatus.OK)
    async adminLogin(@Body() loginDto: LoginDto): Promise<AuthResponserDto> {
        const result = await this.authService.login(loginDto);

        if(result.user.role !== Role.Admin && result.user.role !== Role.Manager){
            throw new UnauthorizedException('Admin access only');
        }

        return result;
    }
}
