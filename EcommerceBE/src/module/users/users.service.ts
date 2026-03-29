import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserResponseDto } from './dto/user-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
    private readonly SALT_ROUNDS = 12;
    constructor(private readonly prisma: PrismaService) { }

    async findAll(): Promise<UserResponseDto[]> {
        return this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                createAt: true,
                updateAt: true,
                password: false
            },
            orderBy: { createAt: 'desc' }
        })
    }

    async findOne(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                createAt: true,
                updateAt: true,
                password: false,
            }
        });

        if (!user) {
            throw new NotFoundException('User not found.')
        }

        return user;
    }

    async update(userId: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
        const existingUser = await this.prisma.user.findUnique({
            where: { id: userId }
        });

        if (!existingUser) {
            throw new NotFoundException('User not found');
        }

        if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
            const emailTaken = await this.prisma.user.findUnique({
                where: { email: updateUserDto.email }
            })
            if (emailTaken) {
                throw new NotFoundException('Email is already taken')
            }
        }

        const updateUser = await this.prisma.user.update({
            where: { id: userId },
            data: updateUserDto,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                createAt: true,
                updateAt: true,
                password: false,
            },
        });

        return updateUser
    }

    async changePassword(userId: string, changePassword: ChangePasswordDto): Promise<{ message: string }> {
        const { currentPassword, newPassword } = changePassword;

        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException('User not found.')
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            throw new NotFoundException('Current password is incorrect')
        }

        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            throw new NotFoundException('New password must be different from the current password')
        }

        const hashPassword = await bcrypt.hash(newPassword, this.SALT_ROUNDS);

        await this.prisma.user.update({
            where: { id: userId },
            data: { password: hashPassword },
        });

        return { message: 'Password changed successfully' }
    }

    async changeRole(userId: string, role: Role) : Promise<{message: string}>{
        const user = await this.prisma.user.findUnique({
            where: {id: userId}
        });

        if(!user){
            throw new NotFoundException('User not found.')
        }
        
        if(user.role === role){
            throw new BadRequestException(`User already has role ${role}`)
        }

        if(!Object.values(Role).includes(role)){
            throw new BadRequestException('Invalid role value')
        }

        if(user.id)
        
        await this.prisma.user.update({
            where:{id: userId},
            data: {role: role},
        })

        return {message: 'Role changed successfully'}
    }

    async deleteAccount(userId: string): Promise<{ message: string }> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId }
        })

        if (!user) {
            throw new NotFoundException('User not found.')
        }

        await this.prisma.user.delete({
            where: {id: userId}
        });

        return { message: 'User account deleted successfully' }
    }

}
