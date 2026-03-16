import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({
        description: 'Email of the user',
        example: 'user@example.com',
    })
    @IsEmail({}, { message: 'Invalid email' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @ApiProperty({
        description: 'Password of the user',
        example: 'password',
    })
    @IsString({ message: 'Invalid password' })
    @IsNotEmpty({ message: 'Password is required' })
    password: string;
}
