import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber } from "class-validator";

export class StatResponse{
    @ApiProperty({description: 'Total product'})
    @IsNumber()
    productCount: number;

    @ApiProperty({description: 'Total order'})
    @IsNumber()
    todayOrderCount: number;

    @ApiProperty({description: 'Today Revenue'})
    @IsNumber()
    todayRevenue: number

    @ApiProperty ({description: 'Revenue in month'})
    @Type(() => Number)
    @IsNumber()
    MonthlyRevenue: number;
}