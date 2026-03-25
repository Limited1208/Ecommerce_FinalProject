import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ProductStatus } from '@prisma/client';

export class UpdateProductStatusDto {
    @ApiProperty({
        enum: ProductStatus,
        example: ProductStatus.InStock
    })
    @IsEnum(ProductStatus)
    status: ProductStatus;
}