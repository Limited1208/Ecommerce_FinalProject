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

    @ApiProperty({
        example: 49.99,
    })
    @IsNumber(
        {
            maxDecimalPlaces: 2,
        },
        {
            message: ''
        }
    )
    @Type(() => Number)
    total: number

}

export class CreateOrderDto {
    @ApiProperty()
    @IsArray()
    @ValidateNested({ each: true})
    @Type(() => OrderItemDto)
    items: OrderItemDto[];

    @ApiProperty({required: false})
    @IsOptional()
    @IsString()
    shippingAddress: string
}