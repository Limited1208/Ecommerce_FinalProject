import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StatResponse } from './dto/stat-response.dto';

@Injectable()
export class StatService {
    constructor(private readonly prisma: PrismaService){

    }

    
    async getStat() : Promise<StatResponse>{
        const now = new Date();
        const startOfDay = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        )
    
        const startOfMonth = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        )
        const productCount = await this.prisma.product.count();
        const todayOrderCount = await this.prisma.order.count({
            where: {
                createdAt: {
                    gte: startOfDay,
                    lte: now,
                }
            },
        });

        const monthlyRevenueAgg = await this.prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: {
            createdAt: { gte: startOfMonth, lte: now },
        },
    });

    const todayRevenueAgg = await this.prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: {
            createdAt: { gte: startOfDay, lte: now },
        },
    });

        return {
            productCount,
            todayOrderCount,
            todayRevenue: Number(todayRevenueAgg._sum.totalAmount) || 0,
            MonthlyRevenue: Number(monthlyRevenueAgg._sum.totalAmount) || 0,
        }
    }

}
