import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { PAYMENT_REPOSITORY_PORT, type IPaymentRepository } from "../ports/payment-repository.port";
import { PaymentGatewayFactory } from "../../factory/payment-gateway.factory";
import { OrderStatus, PaymentProvider } from "@prisma/client";

@Injectable()
export class HandleIpnUseCase {
    constructor(
        @Inject(PAYMENT_REPOSITORY_PORT)
        private readonly paymentRepo: IPaymentRepository,
        private readonly gatewayFactory: PaymentGatewayFactory,
    ) { }

    async execute(provider: PaymentProvider, query: Record<string, any>) {
        const gateway = this.gatewayFactory.getGateway(provider);

        const ipnResult = await gateway.verifyIpn(query);
        if (ipnResult.code !== '00') return ipnResult;

        const verifyResult = await gateway.verifyReturn(query);
        const payment = await this.paymentRepo.findByOrderId(verifyResult.orderId);
        if (!payment) throw new NotFoundException(`Payment with orderId ${verifyResult.orderId} not found`);

        if (payment.status !== 'PENDING') {
            return { code: '02', message: 'Already processed' };
        }

        if (Number(payment.amount) !== verifyResult.amount) {
            return { code: '04', message: 'Invalid amount' };
        }

        await this.paymentRepo.updateByOrderId(verifyResult.orderId, {
            status: verifyResult.success ? 'COMPLETED' : 'FAILED',
            transactionId: verifyResult.providerTxnId ?? null,
        });

        await this.paymentRepo.updateOrderById(payment.orderId, {
            status: verifyResult.success ? OrderStatus.PROCESSING : OrderStatus.CANCELLED,
        })

        return { code: '00', message: 'COMPLETED' };
    }
}