import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';

import { CreatePaymentUseCase } from './application/use-case/create-payment.use-case';
import { HandleReturnUseCase } from './application/use-case/handle-return.use-case';
import { HandleIpnUseCase } from './application/use-case/handle-ipn.use-case';

import { PaymentRepository } from './domain/repositories/payment.repository';
import { PAYMENT_GATEWAY_PORT } from './application/ports/payment-gateway.port';

import { PaymentGatewayFactory } from './factory/payment-gateway.factory';
import { VnpayGateway } from './gateways/vnpay/vnpay.gateway';
import { MomoGateway } from './gateways/momo/momo.gateway';
import { PaypalGateway } from './gateways/paypal/paypal.gateway';

import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [PaymentsController],
    providers: [
        CreatePaymentUseCase,
        HandleReturnUseCase,
        HandleIpnUseCase,
        { provide: PAYMENT_GATEWAY_PORT, useClass: PaymentRepository },
        PaymentGatewayFactory,
        VnpayGateway,
        MomoGateway,
        PaypalGateway,
    ],
})
export class PaymentsModule { }
