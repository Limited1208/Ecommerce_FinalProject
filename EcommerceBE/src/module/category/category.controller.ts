import { Controller, UseGuards, Post, Get, Query, Param, Patch, Delete, HttpCode, HttpStatus, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.decorator';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryResponseDto } from './dto/category-responsive.dto';
import { QueryCategoryDto } from './dto/query-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.Admin)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Create a new category' })
    @ApiBody({ type: CreateCategoryDto })
    @ApiResponse({ status: 201, description: 'Category created successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    async create(@Body() createCategoryDto: CreateCategoryDto): Promise<CategoryResponseDto> {
        return await this.categoryService.create(createCategoryDto)
    }

    @Get()
    @ApiOperation({ summary: 'Get all categories' })
    @ApiResponse({
        status: 200,
        description: 'List of categories retrieved successfully.',
        schema: {
            type: 'object',
            properties: {
                data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/CategoryResponseDto' },
                },
                meta: {
                    type: 'object',
                    properties: {
                        total: { type: 'number' },
                        page: { type: 'number' },
                        limit: { type: 'number' },
                        totalPages: { type: 'number' },
                    },
                },
            },
        },
    })
    async findAll(@Query() query: QueryCategoryDto) {
        return this.categoryService.findAll(query)
    }

    @Get(":id")
    @ApiOperation({ description: 'Get category by id' })
    @ApiResponse({
        status: 200,
        description: 'Category details',
        type: CategoryResponseDto,
    })
    @ApiResponse({ status: 404, description: 'Category not found' })
    async findOne(@Param('id') id: string): Promise<CategoryResponseDto> {
        return this.categoryService.findOne(id);
    }

    @Get("slug/:slug")
    @ApiOperation({
        summary: "Get category by slug"
    })
    @ApiResponse({
        status: 200,
        description: 'Category detail',
        type: CategoryResponseDto
    })
    @ApiResponse({ status: 404, description: 'Category not found' })
    async findBySlug(@Param('slug') slug: string): Promise<CategoryResponseDto> {
        return await this.categoryService.findBySlug(slug);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.Admin)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Update category (Admin only)' })
    @ApiBody({ type: UpdateCategoryDto })
    @ApiResponse({
        status: 200,
        description: 'category updated successfully',
        type: CategoryResponseDto
    })
    @ApiResponse({
        status: 404,
        description: 'Category not found'
    })
    async update(@Param('id') id: string,@Body() updateCategory: UpdateCategoryDto): Promise<CategoryResponseDto> {
        return await this.categoryService.update(id, updateCategory)
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.Admin)
    @ApiBearerAuth('JWT-auth')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Delete category(Admin only)' })
    @ApiResponse({ status: 400, description: "Cannot delete category with products" })
    async remove(@Param('id') id: string): Promise<{ message: string }> {
        return await this.categoryService.remove(id);
    }
}
