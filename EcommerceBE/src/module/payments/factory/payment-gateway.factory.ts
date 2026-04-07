import { Injectable } from "@nestjs/common";
import { PaymentProvider } from "@prisma/client";
import { IPaymentGateway } from "../application/ports/payment-gateway.port";
import { VnpayGateway } from "../gateways/vnpay/vnpay.gateway";
import { MomoGateway } from "../gateways/momo/momo.gateway";
import { PaypalGateway } from "../gateways/paypal/paypal.gateway";

@Injectable()

export class PaymentGatewayFactory {
    private readonly map: Record<PaymentProvider, IPaymentGateway>;

    constructor(
        private readonly vnpay: VnpayGateway,
        private readonly momo: MomoGateway,
        private readonly paypal: PaypalGateway,
    ){
        this.map = {
            [PaymentProvider.VNPAY]: this.vnpay,
            [PaymentProvider.MOMO]: this.momo,
            [PaymentProvider.PAYPAL]: this.paypal,
        };
    }

    getGateway(provider: PaymentProvider) : IPaymentGateway{
        const gateway = this.map[provider];
        if(!gateway){
            throw new Error(`Payment provider ${provider} not supported`);
        }
        return gateway;
    }

}