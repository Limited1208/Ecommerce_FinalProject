export const PAYMENT_GATEWAY_PORT = Symbol('PAYMENT_GATEWAY_PORT');

export interface CreatePaymentRequest{
    orderId: string;
    amount: number;
    orderInfo: string;
    ipAddr: string;
}

export interface CreatePaymentResponse{
    paymentUrl: string;
    orderId: string;
}

export interface VerifyPaymentResponse{
    success: boolean;
    orderId: string;
    amount: number;
    providerTxnId ?: string;
    rawData?: string;
}

export interface IpnResponse{
    code: string;
    message: string;
}

export interface IPaymentGateway {
    createPayment(request: CreatePaymentRequest): Promise<CreatePaymentResponse>;
    verifyReturn(query: Record<string, any>): Promise<VerifyPaymentResponse>;
    verifyIpn(query: Record<string, any>): Promise<IpnResponse>;
}