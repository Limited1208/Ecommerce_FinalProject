import { Order, Payment, Prisma } from "@prisma/client";

export const PAYMENT_REPOSITORY_PORT = Symbol('PAYMENT_REPOSITORY_PORT');

export interface IPaymentRepository {
    create(data: Prisma.PaymentCreateInput) : Promise<Payment>;
    findByOrderId(orderId: string) : Promise<Payment | null>;
    findByUserId(userId: string) : Promise<Payment[]>;
    updateByOrderId(orderId: string, data: Prisma.PaymentUpdateInput) : Promise<Payment>;
    findOrderById(orderId: string) : Promise<Order | null>;
}