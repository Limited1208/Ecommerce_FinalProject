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

    @ApiProperty({ description: 'Phone number', example: '+1 555 000 0000', required: false })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiProperty({ description: 'Street address', example: '123 Main St', required: false })
    @IsOptional()
    @IsString()
    address?: string;

    @ApiProperty({ description: 'City', example: 'New York', required: false })
    @IsOptional()
    @IsString()
    city?: string;

    @ApiProperty({ description: 'Country', example: 'United States', required: false })
    @IsOptional()
    @IsString()
    country?: string;
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
