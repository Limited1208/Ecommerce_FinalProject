import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponsiveDto, OrderResponsiveApiDto } from './dto/order-responsive.dto';

@Injectable()
export class OrderService {
    constructor(private readonly prisma: PrismaService){}

    // async create(userId : string, createOrderDto: CreateOrderDto) : Promise<OrderResponsiveApiDto<OrderResponsiveDto>>{

    // }
}
