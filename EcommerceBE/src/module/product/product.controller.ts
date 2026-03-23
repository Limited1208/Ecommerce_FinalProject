import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.decorator';
import { RoleGuard } from '../auth/guards/role.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { Role } from '@prisma/client';

@ApiTags('products')
@Controller('products')
export class ProductController {
    constructor(private productService: ProductService){}

    // @Post()
    // @UseGuards(JwtAuthGuard, RoleGuard)
    // @Roles(Role.Admin)
    // @ApiBearerAuth('JWT-auth')
    // @ApiOperation({summary: 'Create a new product (Admin, Manager)'})
    // @ApiBody({type: CreateProductDto})
    // async create(@Body() createProductDto: CreateProductDto){

    // }
}
