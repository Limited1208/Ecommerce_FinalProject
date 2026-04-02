import { ApiProperty } from "@nestjs/swagger";
import { OrderStatus } from "@prisma/client";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class UpdateOrderDto{
    @ApiProperty({
        example: 'PENDING'
    })
    @IsOptional()
    @IsEnum(OrderStatus)
    status ?: OrderStatus;

@ApiProperty({
    example: 'VNPOST-123456789',
    description: 'Shipping tracking number',
})
    @IsOptional()
    @IsString()
    trackingNumber?: string;

    @ApiProperty({
    example: 'Customer requested fast delivery. Packed and shipped via VNPost.',
    description: 'Internal note for admin',
})
    @IsOptional()
    @IsString()
    note?: string;
}