import { ApiProperty } from '@nestjs/swagger';
import { Badge, Gender, ProductStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

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
        description: 'Product category',
        example: 'Electronics',
    })
    category: string | null;

    @ApiProperty({
        description: 'Product category ID',
        example: '46545646sds-4584s68sd-4654684sd',
    })
    categoryId: string | null;

    @ApiProperty({
        description: 'Product price',
    })
    price: number;

    @ApiProperty({
        description: 'Product origin price',
    })
    originPrice: number | null;

    @ApiProperty({
        description: 'Product Status',
        enum: ProductStatus
    })
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
        description: 'Product size',
        example: '["S", "M", "L"]'
    })
    sizes: string[];

    @ApiProperty({
        example: ['Machine wash 30°C', 'No bleach', 'Air dry'],
    })
    care: string[];

    @ApiProperty({
        example: ['100% Polyester', 'Mesh liner'],
    })
    material: string[];

    @ApiProperty({
        example: 'Black',
        description: 'Main color of product',
    })
    color: string | null;

    @ApiProperty({
        description: 'Product variant'
    })
    variant: string | null

    @ApiProperty({
        description: 'Product badge',
        enum: Badge
    })
    @IsEnum(Badge)
    badge: Badge

    @ApiProperty({
        description: 'Product gender',
        enum: Gender
    })
    @IsEnum(Gender)
    gender: Gender


    @ApiProperty({
        description: 'Creation timestamp',
    })
    createdAt: Date;

    @ApiProperty({
        description: 'last update timestamp',
    })
    updatedAt: Date;
}