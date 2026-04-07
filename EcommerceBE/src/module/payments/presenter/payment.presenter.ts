import { Payment } from '@prisma/client';
import { PaymentResponseDto } from '../dto/payment-response.dto';

export class PaymentPresenter {
    static toResponse(payment: Payment): PaymentResponseDto {
        return {
            id: payment.id,
            orderId: payment.orderId,
            amount: Number(payment.amount),
            currency: payment.currency,
            status: payment.status,
            paymentMethod: payment.paymentMethod,
            transactionId: payment.transactionId,
            createdAt: payment.createdAt,
        };
    }

    static toCreateResponse(paymentUrl: string, orderId: string) {
        return {
            data: { paymentUrl, orderId },
            message: 'Payment URL created successfully',
            timestamp: new Date().toISOString(),
        };
    }

    static toIpnResponse(code: string, message: string) {
        return { RspCode: code, Message: message };
    }
}