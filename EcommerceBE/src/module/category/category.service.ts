import { BadRequestException, ConflictException, Injectable, NotFoundException, Param } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryResponseDto } from './dto/category-responsive.dto'
import { Category, Prisma } from '@prisma/client';
import { QueryCategoryDto } from './dto/query-category.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
    constructor(private prisma: PrismaService) { }

    async create(createCategory: CreateCategoryDto): Promise<CategoryResponseDto> {
        const { name, slug, ...rest } = createCategory;

        const categorySlug = slug ?? name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

        const existingCategory = await this.prisma.category.findUnique({
            where: { slug: categorySlug },
        });

        if (existingCategory) {
            throw new Error(
                'Category with this slug already exists: ' + categorySlug,
            );
        }

        const category = await this.prisma.category.create({
            data: {
                name,
                slug: categorySlug,
                ...rest,
            },
        });

        return this.formatCategory(category, 0);
    }

    async findAll(query: QueryCategoryDto): Promise<{
        data: CategoryResponseDto[];
        meta: { total: number, page: number, limit: number, totalPages: number }
    }> {
        const { isActive, search, page = 1, limit = 10 } = query;

        const where: Prisma.CategoryWhereInput = {};

        if (isActive !== undefined) {
            where.isActive = isActive;
        }

        if (search) {
            where.OR = [
                {
                    name: { contains: search, mode: 'insensitive' },
                },
                {
                    description: { contains: search, mode: 'insensitive' },
                },
            ];
        }

        const total = await this.prisma.category.count({ where });

        const categories = await this.prisma.category.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { products: true },
                },
            },
        });

        return {
            data: categories.map((category) =>
                this.formatCategory(category, category._count.products),
            ),
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string): Promise<CategoryResponseDto> {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { products: true }
                }
            }
        });

        if (!category) {
            throw new NotFoundException('Category not found');
        }

        return this.formatCategory(category, Number(category._count.products))
    }

    async findBySlug(slug: string): Promise<CategoryResponseDto> {
        const category = await this.prisma.category.findUnique({
            where: { slug },
            include: {
                _count: {
                    select: { products: true },
                },
            },
        });

        if (!category) {
            throw new NotFoundException('Category not found')
        };

        return this.formatCategory(category, Number(category._count.products))
    }

    async update(id: string, updateCategory: UpdateCategoryDto): Promise<CategoryResponseDto> {
        const existingCategory = await this.prisma.category.findUnique({
            where: { id },
        });

        if (!existingCategory) {
            throw new NotFoundException('Category not found');
        };

        if (updateCategory.slug && updateCategory.slug !== existingCategory.slug) {
            const slugTaken = await this.prisma.category.findUnique({
                where: { slug: updateCategory.slug },
            });

            if (slugTaken) {
                throw new ConflictException(
                    `Category with slug ${updateCategory.slug} already exists`
                )
            }
        }
        const updatedCategory = await this.prisma.category.update({
            where: { id },
            data: updateCategory,
            include: {
                _count: {
                    select: { products: true },
                }
            }
        });
        return this.formatCategory(updatedCategory, Number(updatedCategory._count.products))

    }

    async remove(id: string): Promise<{ message: string }> {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        products: true
                    }
                }
            }
        });

        if (!category) {
            throw new NotFoundException('Category not found')
        };

        if (category._count.products > 0) {
            throw new BadRequestException(
                `Cannot delete category with ${category._count.products} products. Remove or reassign first`,
            );
        }

        await this.prisma.category.delete({
            where: { id },
        });

        return { message: 'Category remove successfully' }
    }

    private formatCategory(category: Category, productCount: number): CategoryResponseDto {
        return {
            id: category.id,
            name: category.name,
            description: category.description,
            slug: category.slug,
            imageUrl: category.imageUrl,
            isActive: category.isActive,
            productCount,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt,
        }
    }
}
