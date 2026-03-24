import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { Category, Prisma, Product, ProductStatus } from '@prisma/client';
import { QueryCategoryDto } from '../category/dto/query-category.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { contains } from 'class-validator';

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) { }

    async create(createProductDto: CreateProductDto): Promise<ProductResponseDto> {
        const existingSku = await this.prisma.product.findUnique({
            where: { sku: createProductDto.sku },
        });

        if (existingSku) {
            throw new ConflictException(`Product with sku ${createProductDto.sku} already exist`)
        }

        if(createProductDto.stock == 0){
            
        }

        const product = await this.prisma.product.create({
            data: {
                ...createProductDto,
                price: new Prisma.Decimal(createProductDto.price),
            },
            include: {
                category: true,
            },
        })
        return this.formatProduct(product)
    }

    async findAll(query: QueryProductDto) : Promise<{
        data: ProductResponseDto[];
        meta: {
            total: number,
            page: number,
            limit: number,
            totalPages: number
        }
    }>{
        const {category, isActive, status, search, page = 1, limit = 10} = query;

        const where: Prisma.ProductWhereInput = {};
        if(category){
            where.categoryId = category;
        }

        if (isActive != undefined){
            where.isActive = isActive;
        }

        if(search){
            where.OR = [
                { name: {contains: search, mode: 'insensitive'} }, 
                {description: {contains: search, mode: 'insensitive'}}
            ]
        }

        if(status){
            where.status = ProductStatus.InStock
        }

        const total = await this.prisma.product.count({where})
        const product = await this.prisma.product.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createAt: 'desc'},
            include: {
                category: true,
            }
        });

        return {
            data: product.map((product) => this.formatProduct(product)),
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        }

    }

    private formatProduct( product: Product & { category: Category }, ): ProductResponseDto {
        return {
            ...product,
            price: Number(product.price),
            category: product.category.name,
            originPrice: Number(product.originPrice) || null,
            createdAt: product.createAt,
            updatedAt: product.updateAt
        };
    }
}
