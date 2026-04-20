import { Inject, Injectable } from "@nestjs/common";
import { Order, Payment, Prisma } from "@prisma/client";
import { IPaymentRepository } from "../../application/ports/payment-repository.port";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class PaymentRepository implements IPaymentRepository {
    constructor(private readonly prisma: PrismaService) { }
    findByOrderId(orderId: string): Promise<Payment | null> {
        return this.prisma.payment.findUnique({
            where: { orderId },
        });
    }

    findByUserId(userId: string): Promise<Payment[]> {
        return this.prisma.payment.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }

    updateByOrderId(orderId: string, data: Prisma.PaymentUpdateInput): Promise<Payment> {
        return this.prisma.payment.update({
            where: { orderId },
            data,
        });
    }

    updateOrderById(orderId: string, data: Prisma.OrderUpdateInput): Promise<Order> {
        return this.prisma.order.update({
            where: {id: orderId},
            data
        })
    }

    async create(data: Prisma.PaymentCreateInput): Promise<Payment> {
        return this.prisma.payment.create({ data });
    }

    async findOrderById(orderId: string): Promise<Order | null> {
        return this.prisma.order.findUnique({ where: { id: orderId } });
    }
}