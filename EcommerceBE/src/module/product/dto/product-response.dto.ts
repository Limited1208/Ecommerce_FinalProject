import { ApiProperty } from '@nestjs/swagger';
import { Badge, Gender, ProductStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProductResponseDto {
    @ApiProperty({
        description: 'Product ID',
        example: '46545646sds-4584s68sd-4654684sd',
    })
    id: string;

    @ApiProperty({
        description: 'Product name',
        example: 'Wireless Headphone',
    })
    name: string;

    @ApiProperty({
        description: 'Product description',
        example: 'High quality wireless headphones',
        nullable: true,
    })
    description: string | null;

    @ApiProperty({
        description: 'Product price',
        example: 99.99,
    })
    price: number;

    @ApiProperty({
        description: 'Product origin price',
        example: 95.20,
    })
    @IsNumber({maxDecimalPlaces: 2})
    originPrice: number

    @ApiProperty({
        description: 'Product Status',
        enum: ProductStatus
    })
    @IsNotEmpty()
    @IsEnum(ProductStatus)
    status: ProductStatus

    @ApiProperty({
        description: 'Product stock',
        example: 100,
    })
    stock: number;

    @ApiProperty({
        description: 'Stock keeping Unit',
        example: 'WH-001',
    })
    sku: string;

    @ApiProperty({
        description: 'Product image url',
        example: 'https://example.com/image.jpg',
    })
    imageUrl: string | null;

    @ApiProperty({
        description: 'Product care',
        example: 'Wash cold, do not bleach'
    })
    care?: string

    @ApiProperty({
        description: 'Product material'
    })
    @IsString()
    material?: string

    @ApiProperty({
        description: 'Product variant'
    })
    @IsString()
    variant?: string

    @ApiProperty({
        description: 'Product badge',
        enum: Badge
    })
    @IsEnum(Badge)
    @IsNotEmpty()
    badge: Badge

    @ApiProperty({
        description: 'Product gender',
        enum: Gender
    })
    @IsEnum(Gender)
    @IsNotEmpty()
    gender: Gender

    @ApiProperty({
        description: 'Product category',
        example: 'Electronics',
    })
    category: string | null;

    @ApiProperty({
        description: 'Product availability status',
        example: true,
    })
    isActive: boolean;

    @ApiProperty({
        description: 'Creation timestamp',
    })
    createdAt: Date;

    @ApiProperty({
        description: 'last update timestamp',
    })
    updatedAt: Date;
}