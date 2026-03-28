import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags, ApiTooManyRequestsResponse, getSchemaPath } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.decorator';
import { RoleGuard } from '../auth/guards/role.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderApiResponseDto, OrderResponseDto, PaginatedOrderResponseDto } from './dto/order-responsive.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { Role } from '@prisma/client';
import { ModerateThrottle, RelaxedThrottle } from 'src/common/decorators/customer-throttle.decorator';
import { QueryOrderDto } from './dto/query-order.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UpdateOrderDto } from './dto/update-order.dto';

@ApiTags('orders')
@ModerateThrottle()
@ApiBearerAuth('JWT-auth')
@Controller('orders')
@UseGuards(JwtAuthGuard, RoleGuard)
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new order' })
    @ApiBody({
        type: CreateOrderDto
    })
    @ApiCreatedResponse({
        description: 'Order created successfully',
        type: OrderApiResponseDto
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
    async create(@Body() createOrderDto: CreateOrderDto, @GetUser('id') userId: string) {
        return await this.orderService.create(userId, createOrderDto);
    }


    @Get('admin/all')
    @Roles(Role.Admin)
    @RelaxedThrottle()
    @ApiOperation({ summary: 'Get all orders with optional filter' })
    @ApiResponse({
        status: 200,
        description: 'All orders'
    })
    @ApiQuery({
        name: 'page', required: false, type: String
    })
    @ApiQuery({
        name: 'page', required: false, type: Number
    })
    @ApiQuery({
        name: 'limit', required: false, type: Number
    })
    @ApiResponse({
        description: 'List of orders',
        schema: {
            type: 'object',
            properties: {
                data: {
                    type: 'array',
                    items: { $ref: getSchemaPath(OrderResponseDto) }
                },
                total: { type: "number" },
                page: { type: "number" },
                limit: { type: "number" },
            }
        },
    })
    @ApiForbiddenResponse({
        description: 'Admin access required'
    })
    async findAllForAdmin(@Query() query: QueryOrderDto) {
        return await this.orderService.findAllForAdmin(query)
    }

    @Get('user/all')
    @RelaxedThrottle()
    @ApiOperation({ summary: 'Get all orders for current user (paginated)' })
    @ApiQuery({
        name: 'page', required: false, type: String
    })
    @ApiQuery({
        name: 'page', required: false, type: Number
    })
    @ApiQuery({
        name: 'limit', required: false, type: Number
    })
    @ApiOkResponse({
        description: "List of user orders",
        type: PaginatedOrderResponseDto,
    })
    async findAll(@Query() query: QueryOrderDto, @GetUser('id') userId: string) {
        return await this.orderService.findAll(userId, query);
    }

    @Get('admin/:id')
    @Roles(Role.Admin)
    @RelaxedThrottle()
    @ApiOperation({
        summary: '[ADMIN]: Get order by id',
    })
    @ApiParam({
        name: 'id',
        description: 'Order ID',
    })
    @ApiOkResponse({
        description: 'Order details',
        type: OrderApiResponseDto,
    })
    @ApiNotFoundResponse({
        description: 'Order not found',
    })
    @ApiForbiddenResponse({
        description: 'Admin access required',
    })
    async findOneAdmin(@Param('id') id: string) {
        return await this.orderService.findOne(id);
    }

    @Get(':id')
    @RelaxedThrottle()
    @ApiOperation({summary: 'Get an order by ID for current user'})
    @ApiParam({
        name: 'id',
        description: 'Order ID'
    })
    @ApiOkResponse({description: 'Order details', type: OrderApiResponseDto})
    @ApiResponse({description: 'Order not found'})
    async findOne(@Param('id') id: string, @GetUser('id') userId: string){
        return await this.orderService.findOne(id, userId);
    }

    @Patch('admin/:id')
    @Roles(Role.Admin)
    @ModerateThrottle()
    @ApiOperation({
        summary: "Update any order (Admin)"
    })
    @ApiParam({name: 'id', description: 'Order Id'})
    @ApiBody({type: UpdateOrderDto})
    @ApiOkResponse({
        description: 'Order update successfully',
        type: OrderApiResponseDto
    })
    @ApiNotFoundResponse({
        description: 'Order not found'
    })
    @ApiForbiddenResponse({
        description: 'Admin access required'
    })
    async updateAdmin(@Param('id') id: string, @Body() dto: UpdateOrderDto){
        return await this.orderService.update(id, dto)
    }

    @Patch(':id')
    @ModerateThrottle()
    @ApiOperation({
        summary: 'Update your own order'
    })
    @ApiParam({
        name: 'id', description: 'Order Id'
    })
    @ApiBody({type: UpdateOrderDto})
    @ApiOkResponse({
        description: 'Order updated successfully'
    })
    @ApiNotFoundResponse({
        description: 'Order not found'
    })
    async updateUser(@Param('id') id: string, @Body() dto: UpdateOrderDto, @GetUser('id') userId: string){
        return await this.orderService.update(id, dto, userId);
    }

    @Delete('admin/:id')
    @Roles(Role.Admin)
    @ModerateThrottle()
    @ApiOperation({summary: 'Cancel order by Id (Admin)'})
    @ApiParam({
        name: 'id', description: 'Order ID',
    })
    @ApiOkResponse({
        description: 'Order cancelled!',
        type: OrderApiResponseDto,
    })
    @ApiNotFoundResponse({
        description: 'Order not found',
    })
    async cancelAdmin(@Param('id') id: string){
        await this.orderService.cancel(id);
    }

    @Delete(':id')
    @ModerateThrottle()
    @ApiOperation({summary: 'Cancel order by Id'})
    @ApiParam({
        name: 'id', description: 'Order ID',
    })
    @ApiOkResponse({
        description: 'Order cancelled!',
        type: OrderApiResponseDto,
    })
    @ApiNotFoundResponse({
        description: 'Order not found',
    })
    async cancel(@Param('id') id: string, @GetUser('id') userId: string){
        await this.orderService.cancel(id, userId);
    }

}
