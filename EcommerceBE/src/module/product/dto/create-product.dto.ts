import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {IsString, IsOptional, IsNumber, IsInt, IsBoolean, IsEnum, IsUUID, Min,} from 'class-validator';
import { ProductStatus, Badge, Gender } from '@prisma/client';

export class CreateProductDto {
    @ApiProperty({ example: 'T-Shirt Basic' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'SKU-12345' })
    @IsString()
    sku: string;

    @ApiPropertyOptional({ example: 'High quality cotton t-shirt' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ example: 199000 })
    @IsNumber()
    @Min(0)
    price: number;

    @ApiPropertyOptional({ example: 249000 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    originPrice?: number;

    @ApiPropertyOptional({ example: 100, default: 0 })
    @IsOptional()
    @IsInt()
    @Min(0)
    stock?: number;

    @ApiPropertyOptional({ example: 'https://example.com/image.jpg' })
    @IsOptional()
    @IsString()
    imageUrl?: string;

    @ApiProperty({ enum: ProductStatus })
    @IsEnum(ProductStatus)
    status: ProductStatus;

    @ApiPropertyOptional({ default: true })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @ApiPropertyOptional({ example: 'Wash cold, do not bleach' })
    @IsOptional()
    @IsString()
    care?: string;

    @ApiPropertyOptional({ example: 'Cotton 100%' })
    @IsOptional()
    @IsString()
    material?: string;

    @ApiPropertyOptional({ example: 'Size M - Black' })
    @IsOptional()
    @IsString()
    variant?: string;

    @ApiProperty({ enum: Badge })
    @IsEnum(Badge)
    badge: Badge;

    @ApiProperty({ enum: Gender })
    @IsEnum(Gender)
    gender: Gender;

    @ApiProperty({ example: 'category-uuid' })
    @IsUUID()
    categoryId: string;
}