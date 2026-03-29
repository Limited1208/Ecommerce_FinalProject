import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.decorator';
import { RoleGuard } from '../auth/guards/role.guard';
import { UsersService } from './users.service';
import type { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { UserResponseDto } from './dto/user-response.dto';
import { UpdateUserDto, UpdateUserRoleDto } from './dto/update-user.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiTags('users')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {

    }

    @Get()
    @Roles(Role.Admin)
    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({
        status: 200,
        description: 'List of all users',
        type: [UserResponseDto]
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async findAll(): Promise<UserResponseDto[]> {
        return await this.userService.findAll();
    }

    @Get('me')
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({
        status: 200,
        description: 'The current user profile',
        type: UserResponseDto,
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getProfile(@Req() req: RequestWithUser): Promise<UserResponseDto> {
        return await this.userService.findOne(req.user.id)
    };

    @Get(':id')
    @Roles(Role.Admin)
    @ApiOperation({ summary: 'Get user by id' })
    @ApiResponse({
        status: 200,
        description: 'The user with the specified ID',
        type: UserResponseDto,
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async findOne(@Param('id') id: string): Promise<UserResponseDto> {
        return await this.userService.findOne(id)
    }

    @Patch('me')
    @ApiOperation({ summary: 'Update user' })
    @ApiBody({ type: UpdateUserDto })
    @ApiResponse({
        status: 200,
        description: 'The update user profile',
        type: UserResponseDto,
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 409, description: 'Email already in use' })
    async updateProfile(@GetUser('id') userId: string, @Body() updateProfile: UpdateUserDto): Promise<UserResponseDto> {
        return this.userService.update(userId, updateProfile)
    }

    @Patch('me/password')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Change current user password' })
    @ApiResponse({ status: 200, description: 'Password change successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async changePassword(@GetUser('id') userId: string, @Body() changePasswordDto: ChangePasswordDto): Promise<{ message: string }> {
        return this.userService.changePassword(userId, changePasswordDto)
    }

    @Patch(':id/role')
    @Roles(Role.Admin)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({summary: 'Change user role'})
    @ApiResponse({status: 200, description: 'Change account role successfully'})
    @ApiResponse({status: 401, description: 'Unauthorized'})
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({status: 400, description: 'BadRequest'})
    async changeRole(@Param('id') userId: string,@Body() body: UpdateUserRoleDto) : Promise<{message: string}>{
        return this.userService.changeRole(userId, body.role);
    }

    @Delete('me')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Delete current user account' })
    @ApiResponse({ status: 200, description: 'User account deleted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async deleteAccount(@GetUser('id') userId: string) : Promise<{ message: string }>{
        return this.userService.deleteAccount(userId);
    }

    @Delete(':id')
    @Roles(Role.Admin)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Delete user by id' })
    @ApiResponse({ status: 200, description: 'User with the specified ID deleted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async deleteUser(@Param('id') id: string) : Promise<{message: string}> {
        return await this.userService.deleteAccount(id);
    }
}
