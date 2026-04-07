import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import {
    IPaymentGateway,
    CreatePaymentRequest,
    CreatePaymentResponse,
    VerifyPaymentResponse,
    IpnResponse,
} from '../../application/ports/payment-gateway.port';

@Injectable()
export class PaypalGateway implements IPaymentGateway {
    constructor(private readonly config: ConfigService) { }

    private get baseUrl(): string {
        return this.config.get('PAYPAL_MODE') === 'live'
            ? 'https://api-m.paypal.com'
            : 'https://api-m.sandbox.paypal.com';
    }

    private async getAccessToken(): Promise<string> {
        const credentials = Buffer.from(
            `${this.config.get('PAYPAL_CLIENT_ID')}:${this.config.get('PAYPAL_CLIENT_SECRET')}`,
        ).toString('base64');

        const { data } = await axios.post(
            `${this.baseUrl}/v1/oauth2/token`,
            'grant_type=client_credentials',
            {
                headers: {
                    Authorization: `Basic ${credentials}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            },
        );
        return data.access_token;
    }

    async createPayment(input: CreatePaymentRequest): Promise<CreatePaymentResponse> {
        const token = await this.getAccessToken();
        const returnUrl = this.config.get('PAYPAL_RETURN_URL');

        const { data } = await axios.post(
            `${this.baseUrl}/v2/checkout/orders`,
            {
                intent: 'CAPTURE',
                purchase_units: [{
                    reference_id: input.orderId,
                    description: input.orderInfo,
                    amount: {
                        currency_code: 'USD',
                        value: (input.amount / 25000).toFixed(2),
                    },
                }],
                application_context: {
                    return_url: `${returnUrl}?orderId=${input.orderId}`,
                    cancel_url: `${returnUrl}?orderId=${input.orderId}&cancelled=true`,
                },
            },
            { headers: { Authorization: `Bearer ${token}` } },
        );

        const approveUrl = data.links.find((l: any) => l.rel === 'approve').href;
        return { paymentUrl: approveUrl, orderId: input.orderId };
    }

    async verifyReturn(query: Record<string, any>): Promise<VerifyPaymentResponse> {
        const { token: paypalOrderId, orderId } = query;
        const accessToken = await this.getAccessToken();

        const { data } = await axios.post(
            `${this.baseUrl}/v2/checkout/orders/${paypalOrderId}/capture`,
            {},
            { headers: { Authorization: `Bearer ${accessToken}` } },
        );

        const unit = data.purchase_units?.[0];
        const capture = unit?.payments?.captures?.[0];

        return {
            success: data.status === 'COMPLETED',
            orderId: unit?.reference_id || orderId,
            amount: parseFloat(capture?.amount?.value || '0') * 25000,
            providerTxnId: capture?.id,
            rawData: data,
        };
    }

    async verifyIpn(_body: Record<string, any>): Promise<IpnResponse> {
        return { code: '00', message: 'Use PayPal Webhook instead' };
    }
}