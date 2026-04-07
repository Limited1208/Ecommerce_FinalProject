import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { PaymentGatewayFactory } from "../../factory/payment-gateway.factory";
import type { IPaymentRepository } from "../ports/payment-repository.port";
import { PAYMENT_GATEWAY_PORT } from "../ports/payment-gateway.port";
import { PaymentProvider } from "@prisma/client";

@Injectable()
export class HandleReturnUseCase{
    constructor(
        @Inject(PAYMENT_GATEWAY_PORT)
        private readonly paymentRepo: IPaymentRepository,
        private readonly gatewayFactory: PaymentGatewayFactory,
    ){}

    async execute(provider: PaymentProvider, query: Record<string, any>){
        const gateway = this.gatewayFactory.getGateway(provider);
        const result = await gateway.verifyReturn(query);

        const payment = await this.paymentRepo.findByOrderId(result.orderId);
        if(!payment){
            throw new NotFoundException('Payment not found for orderId: ' + result.orderId);
        }

        if(payment.status === 'PENDING'){
            await this.paymentRepo.updateByOrderId(result.orderId, {
                status: result.success ? 'COMPLETED' : 'FAILED',
                transactionId: result.providerTxnId ?? null,
            });
        }

        return result;
    }
}