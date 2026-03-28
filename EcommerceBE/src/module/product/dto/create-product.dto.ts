import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsBoolean, IsEnum, Min, IsNotEmpty, MaxLength, } from 'class-validator';
import { ProductStatus, Badge, Gender } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateProductDto {
    @ApiProperty({
        description: 'Product Name',
        example: 'T-Shirt Basic',
        maxLength: 200
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    name: string;

    @ApiProperty({
        description: 'Stock keeping Unit (Sku) -unique identifier',
        example: 'SKU-12345',
        maxLength: 50
    })
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    sku: string;

    @ApiPropertyOptional({
        description: 'Product description',
        example: 'High quality cotton t-shirt',
        maxLength: 200
    })
    @IsOptional()
    @IsString()
    @MaxLength(200)
    description?: string;

    @ApiProperty({
        description: 'Product price in USD',
        example: 199,
        minimum: 0
    })
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsNotEmpty()
    @Min(0)
    @Type(() => Number)
    price: number;

    @ApiPropertyOptional({
        description: 'Product price after sale',
        example: 249,
        minimum: 0,
    })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @Type(() => Number)
    originPrice?: number;

    @ApiPropertyOptional({
        description: 'Stock quantity',
        example: 100,
        default: 0,
        minimum: 0
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    stock?: number;

    @ApiPropertyOptional({
        description: 'Product image link',
        example: 'https://example.com/image.jpg',
        required: false
    })
    @IsOptional()
    @IsString()
    imageUrl?: string;

    @ApiProperty({
        description: 'Product status',
        enum: ProductStatus
    })
    @IsNotEmpty()
    @IsEnum(ProductStatus)
    status: ProductStatus;

    @ApiPropertyOptional({
        description: 'Product care',
        example: 'Wash cold, do not bleach',
        maxLength: 200
    })
    @IsOptional()
    @IsString()
    @MaxLength(200)
    care?: string;

    @ApiPropertyOptional({
        description: 'Product material',
        example: 'Cotton 100%',
        maxLength: 200
    })
    @MaxLength(200)
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

    @ApiProperty({
        description: 'Product category',
        example: '74641fcd-4043-4ede-b006-8dbd18187a63',
        required: true,
    })
    @IsString()
    categoryId: string;
}