import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { PAYMENT_GATEWAY_PORT } from "../ports/payment-gateway.port";
import { PaymentGatewayFactory } from "../../factory/payment-gateway.factory";
import type { IPaymentRepository } from "../ports/payment-repository.port";
import { CreatePaymentDto } from "../../dto/create-payment.dto";
import { PaymentStatus, Prisma } from "@prisma/client";

@Injectable()
export class CreatePaymentUseCase {
    constructor(
        @Inject(PAYMENT_GATEWAY_PORT)
        private readonly paymentRepo: IPaymentRepository,
        private readonly gatewayFactory: PaymentGatewayFactory,
    ) { }

    async execute(dto: CreatePaymentDto, userId: string, ipAddr: string) {
        const order = await this.paymentRepo.findOrderById(dto.orderId);
        if (!order) {
            throw new NotFoundException(`Order ${dto.orderId} not found`);
        }

        if (order.userId !== userId) {
            throw new ForbiddenException('You do not own this order');
        }

        if (order.status !== 'PENDING') {
            throw new BadRequestException(
                `Order is ${order.status}, only PENDING orders can be paid`,
            );
        }

        const existing = await this.paymentRepo.findByOrderId(dto.orderId);
        if (existing && existing.status === 'COMPLETED') {
            throw new BadRequestException('Order has already been paid');
        }

        const amount = Number(order.totalAmount);
        const orderInfo = `Payment for order ${order.id}`;

        const gateway = this.gatewayFactory.getGateway(dto.provider);
        const { paymentUrl } = await gateway.createPayment({
            orderId: dto.orderId,
            amount,
            orderInfo,
            ipAddr,
        });

        const data: Prisma.PaymentCreateInput = {
            amount: amount,
            status: 'PENDING',
            currency: 'USD',
            paymentMethod: dto.provider,
            user: { connect: { id: userId } },
            order: { connect: { id: dto.orderId } },
        };

        if (existing) {
            await this.paymentRepo.updateByOrderId(dto.orderId, {
                status: 'PENDING',
                paymentMethod: dto.provider,
                transactionId: null,
            });
        } else {
            await this.paymentRepo.create(data);
        }

        return { paymentUrl, orderId: dto.orderId, amount };
    }
}