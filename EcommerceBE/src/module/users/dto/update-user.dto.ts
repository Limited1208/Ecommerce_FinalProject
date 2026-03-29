import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

// DTO for updating user profile
export class UpdateUserDto {
    @ApiProperty({
        description: 'User eamil address',
        example: 'user@example.com',
        required: false,
    })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiProperty({
        description: 'User first name',
        example: 'John',
        required: false,
    })
    @IsOptional()
    @IsString()
    firstName?: string;

    @ApiProperty({
        description: 'User last name',
        example: 'Doe',
        required: false,
    })
    @IsOptional()
    @IsString()
    lastName?: string;
}

export class UpdateUserRoleDto{
    @ApiProperty({
        description: 'Role of the user',
        enum: Role,
        example: 'Admin',
    })
    @IsEnum(Role)
    role: Role;
}
