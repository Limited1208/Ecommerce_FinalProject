import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';

import { CreatePaymentUseCase } from './application/use-case/create-payment.use-case';
import { HandleReturnUseCase } from './application/use-case/handle-return.use-case';
import { HandleIpnUseCase } from './application/use-case/handle-ipn.use-case';

import { PaymentRepository } from './domain/repositories/payment.repository';


import { PaymentGatewayFactory } from './factory/payment-gateway.factory';
import { VnpayGateway } from './gateways/vnpay/vnpay.gateway';
import { MomoGateway } from './gateways/momo/momo.gateway';
import { PaypalGateway } from './gateways/paypal/paypal.gateway';

import { PrismaModule } from 'src/prisma/prisma.module';
import { PAYMENT_REPOSITORY_PORT } from './application/ports/payment-repository.port';

@Module({
    imports: [PrismaModule],
    controllers: [PaymentsController],
    providers: [
        CreatePaymentUseCase,
        HandleReturnUseCase,
        HandleIpnUseCase,
        { provide: PAYMENT_REPOSITORY_PORT, useClass: PaymentRepository },
        PaymentGatewayFactory,
        VnpayGateway,
        MomoGateway,
        PaypalGateway,
    ],
})
export class PaymentsModule { }
