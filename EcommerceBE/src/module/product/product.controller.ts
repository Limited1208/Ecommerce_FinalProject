import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.decorator';
import { RoleGuard } from '../auth/guards/role.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ProductStatus, Role } from '@prisma/client';
import { QueryProductDto } from './dto/query-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateProductStatusDto } from './dto/update-product-status.dto';

@ApiTags('products')
@Controller('products')
export class ProductController {
    constructor(private productService: ProductService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.Admin)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Create a new product (Admin, Manager)' })
    @ApiBody({ type: CreateProductDto })
    async create(@Body() createProductDto: CreateProductDto): Promise<ProductResponseDto> {
        return this.productService.create(createProductDto)
    }

    @Get()
    @ApiOperation({ summary: 'Get all products with optional filters' })
    @ApiResponse({
        status: 200,
        description: 'List of products with pagination',
        schema: {
            type: 'object',
            properties: {
                data: {
                    type: "array",
                    items: { $ref: '#/components/schemas/ProductResponseDto' }
                },

                meta: {
                    type: "object",
                    properties: {
                        total: { type: "number" },
                        page: { type: "number" },
                        limit: { type: "number" },
                        totalPages: { type: "number" }
                    }
                }
            }
        }
    })
    async findAll(@Query() queryDto: QueryProductDto) {
        return await this.productService.findAll(queryDto)
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get product by id' })
    @ApiResponse({
        status: 200,
        description: 'Product detail',
        type: ProductResponseDto,
    })
    @ApiResponse({
        status: 404,
        description: 'Product not found',
    })
    async findOne(@Param('id') id: string): Promise<ProductResponseDto> {
        return await this.productService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.Admin)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Update a product (ADMIN ONLY)' })
    @ApiBody({
        type: UpdateProductDto
    })
    @ApiResponse({
        status: 200,
        description: 'Product updated successfully',
        type: ProductResponseDto
    })
    @ApiResponse({
        status: 404,
        description: 'Product not found'
    })
    @ApiResponse({
        status: 409,
        description: 'Sku already exists'
    })
    async update(@Param('id') id: string,@Body() updateProductDto: UpdateProductDto): Promise<ProductResponseDto> {
        return await this.productService.update(id, updateProductDto)
    }

    @Patch(':id/status')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.Admin)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({
        summary: 'Update product stock (Admin Only)',
    })
    @ApiBody({
    schema: {
        type: 'object',
        properties: {
            status: {
                type: 'string',
                enum: Object.values(ProductStatus),
            }
        }
    }
})
    @ApiResponse({
        status: 200,
        description: 'Stock updated successfully',
        type: ProductResponseDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Insufficient stock',
    })
    @ApiResponse({
        status: 404,
        description: 'Product not found',
    })
    updateStatus(@Param('id') id: string, @Body() body: UpdateProductStatusDto) {
        return this.productService.updateStatus(id, body.status)
    }

    @Patch(':id/stock')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.Admin)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({
        summary: 'Update product stock (Admin Only)',
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                quantity: {
                    type: 'number',
                    description:
                        'Stock adjustment ( positive to add, negative to subtract) ',
                    example: 10,
                },
            },
            required: ['quantity'],
        },
    })
    @ApiResponse({
        status: 200,
        description: 'Stock updated successfully',
        type: ProductResponseDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Insufficient stock',
    })
    @ApiResponse({
        status: 404,
        description: 'Product not found',
    })
    async updateStock(
        @Param('id') id: string,
        @Body('quantity') quantity: number,
    ): Promise<ProductResponseDto> {
        return await this.productService.updateStock(id, quantity)
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.Admin)
    @ApiBearerAuth('JWT-auth')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Delete a product (ADMIN ONLY)' })
    @ApiResponse({
        status: 200,
        description: 'Delete Product (ADMIN ONLY)'
    })
    @ApiResponse({
        status: 404,
        description: 'Product not found'
    })
    @ApiResponse({
        status: 400,
        description: 'Cannot delete product in active orders',
    })
    async delete(@Param('id') id: string): Promise<{ message: string }> {
        return await this.productService.remove(id);
    }
}
