import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiNotFoundResponse, ApiOperation, ApiResponse, ApiTags, ApiTooManyRequestsResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.decorator';
import { RoleGuard } from '../auth/guards/role.guard';
import { ModerateThrottle } from 'src/common/decorators/customer-throttle.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponsiveApiDto } from './dto/order-responsive.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';

@ApiTags('orders')
@ApiBearerAuth('JWT-auth')
@Controller('orders')
@UseGuards(JwtAuthGuard, RoleGuard)
export class OrderController {
    constructor(private readonly orderService: OrderService){}

    @Post()
    @ModerateThrottle()
    @ApiOperation({summary: 'Create a new order'})
    @ApiBody({
        type: CreateOrderDto
    })
    @ApiCreatedResponse({
        description: 'Order created successfully',
        type: OrderResponsiveApiDto
    })
    @ApiNotFoundResponse({
        description: 'Invalid data or insufficient stock'
    })
    @ApiNotFoundResponse({
        description: 'Cart not found or empty'
    })
    @ApiTooManyRequestsResponse({
        description: 'Too many requests - rate limit exceeded'
    })
    async create(@Body() createOrderDto: CreateOrderDto, @GetUser('id') userId : string){
        return await this.orderService.create(createOrderDto, userId);
    }


    // @Get()
    // @ApiOperation({summary: 'Get all orders with optional filter'})
    // @ApiResponse({
    //     status: 200,
    //     description: 'All orders'
    // })
    // async getAll()
}
