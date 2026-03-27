import { ApiProperty } from "@nestjs/swagger";
import { OrderStatus } from "@prisma/client";

export class OrderResponsiveApiDto<T>{
    @ApiProperty({
        description: 'Indicated if the request was successfully'
    })
    success: boolean

    @ApiProperty({
        description: 'Return data',
        type: Object
    })
    data: T

    @ApiProperty({
        description: 'Optional message',
        nullable: true,
        required: false,
    })
    message: string
}

export class OrderResponsiveDto{
    @ApiProperty()
    id: string

    @ApiProperty()
    userId: string

    @ApiProperty()
    static: OrderStatus

    @ApiProperty()
    total: number

    @ApiProperty()
    shippingAddress: string
}