import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { PaymentProvider } from "@prisma/client";

export class CreatePaymentDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Order ID to be paid', example: '123e4567-e89b-12d3-a456-426614174000' })
    orderId: string;

    @IsEnum(PaymentProvider)
    @ApiProperty({ description: 'Payment provider', example: 'VNPAY' })
    provider: PaymentProvider;
}