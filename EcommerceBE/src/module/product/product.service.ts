import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { Category, Prisma, Product, ProductStatus } from '@prisma/client';
import { QueryProductDto } from './dto/query-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

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

        if (createProductDto.stock == 0) {

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

    async findAll(query: QueryProductDto): Promise<{
        data: ProductResponseDto[];
        meta: {
            total: number,
            page: number,
            limit: number,
            totalPages: number
        }
    }> {
        const { category, isActive, status, search, page = 1, limit = 10 } = query;

        const where: Prisma.ProductWhereInput = {};
        if (category) {
            where.categoryId = category;
        }

        if (isActive != undefined) {
            where.isActive = isActive;
        }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ]
        }

        if (status) {
            where.status = ProductStatus.InStock
        }

        const total = await this.prisma.product.count({ where })
        const product = await this.prisma.product.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createAt: 'desc' },
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

    async findOne(id: string): Promise<ProductResponseDto> {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
            }
        });

        if (!product) {
            throw new BadRequestException('Product not found')
        }

        return this.formatProduct(product)

    }

    async update(id: string, updateProductDto: UpdateProductDto): Promise<ProductResponseDto> {
        const existingProduct = await this.prisma.product.findUnique({
            where: { id },
        });

        if (!existingProduct) {
            throw new BadRequestException('Product not found')
        }

        if (updateProductDto.sku && updateProductDto.sku !== existingProduct.sku) {
            const skuTaken = await this.prisma.product.findUnique({
                where: { sku: updateProductDto.sku }
            })

            if (!skuTaken) {
                throw new ConflictException(
                    `Product with SKU ${updateProductDto.sku} already exist`
                )
            }
        }

        const updateData: any = { ...updateProductDto };
        if (updateProductDto.price != undefined) {
            updateData.price = new Prisma.Decimal(updateProductDto.price)
        }

        const updatedProduct = await this.prisma.product.update({
            where: { id },
            data: updateData,
            include: {
                category: true,
            }
        });

        return await this.formatProduct(updatedProduct);
    }

    async updateStatus(id: string, status: ProductStatus ) : Promise<ProductResponseDto> {
        const product = await this.prisma.product.findUnique({
            where: {id},
        });

        if(!product){
            throw new NotFoundException('Product not found')
        }

        const updatedProduct = await this.prisma.product.update({
            where: {id},
            data: {status: status},
            include: {
                category: true
            },
        });

        return this.formatProduct(updatedProduct);
    }

    async remove(id: string): Promise<{ message: string }> {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                orderItem: true,
                cartItem: true,
            },
        });

        if (!product) {
            throw new NotFoundException('Product not found')
        }

        if (product.orderItem.length > 0) {
            throw new BadRequestException('Cannot delete product that is part of existing orders. Consider marking it as inactive only')
        }

        await this.prisma.product.delete({
            where: { id }
        })
        return { message: 'Product remove successfully' }
    }

    private formatProduct(product: Product & { category: Category },): ProductResponseDto {
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
