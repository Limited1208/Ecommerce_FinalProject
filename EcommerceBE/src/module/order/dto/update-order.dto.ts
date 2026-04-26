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
        example: '2024-06-01T12:00:00Z',
        description: 'The date and time when the order was placed'
    })
    @IsOptional()
    updatedAt?: Date;
}