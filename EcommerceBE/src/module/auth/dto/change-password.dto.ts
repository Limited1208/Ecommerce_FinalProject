import { IsNotEmpty, MinLength, IsString, Matches } from "class-validator"

export class ChangePasswordDto{
    @IsNotEmpty()
    currentPassword: string

    @IsNotEmpty()
    @IsString({ message: 'Password must be a string' })
        @MinLength(8, { message: 'Password must be at least 8 characters' })
        @IsNotEmpty({ message: 'Password is required' })
        @Matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            {
                message:
                    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
            },
        )
    newPassword: string
}