import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { PaymentGatewayFactory } from "../../factory/payment-gateway.factory";
import { PAYMENT_REPOSITORY_PORT, type IPaymentRepository } from "../ports/payment-repository.port";
import { PaymentProvider } from "@prisma/client";

@Injectable()
export class HandleReturnUseCase{
    constructor(
        @Inject(PAYMENT_REPOSITORY_PORT)
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