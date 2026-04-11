import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

class OrderItemDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    productId: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    quantity: number;
}

export class CreateOrderDto {
    @ApiProperty({ type: [OrderItemDto]})
    @IsArray()
    @ValidateNested({ each: true})
    @Type(() => OrderItemDto)
    items: OrderItemDto[];

    @ApiProperty({required: false})
    @IsOptional()
    @IsString()
    shippingAddress: string
}

export class GuestDto {
    
}