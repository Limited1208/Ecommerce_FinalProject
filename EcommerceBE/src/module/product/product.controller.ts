import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.decorator';
import { RoleGuard } from '../auth/guards/role.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ProductStatus, Role } from '@prisma/client';
import { QueryProductDto } from './dto/query-product.dto';

@ApiTags('products')
@Controller('products')
export class ProductController {
    constructor(private productService: ProductService){}

    @Post()
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.Admin)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({summary: 'Create a new product (Admin, Manager)'})
    @ApiBody({type: CreateProductDto})
    async create(@Body() createProductDto: CreateProductDto): Promise<ProductResponseDto>{
        return this.productService.create(createProductDto)
    }

    @Get()
    @ApiOperation({ summary: 'Get all products with optional filters'})
    @ApiResponse({
        status: 200,
        description: 'List of products with pagination',
        schema: {
            type: 'object',
            properties: {
                data: {
                    type:"array",
                    items: { $ref: '#/components/schemas/ProductResponseDto'}
                },

                meta: {
                    type: "object",
                    properties: {
                        total: {type: "number"},
                        page: {type: "number"},
                        limit: {type: "number"},
                        totalPages: {type: "number"}
                    }
                }
            }
        }
    })
    async findAll(@Query() queryDto: QueryProductDto){
        return await this.productService.findAll(queryDto)
    }
}
