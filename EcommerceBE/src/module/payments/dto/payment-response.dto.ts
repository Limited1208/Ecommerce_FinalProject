import { PaymentStatus } from '@prisma/client';

export class PaymentResponseDto {
    id: string;
    orderId: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
    paymentMethod: string | null;
    transactionId: string | null;
    createdAt: Date;
}