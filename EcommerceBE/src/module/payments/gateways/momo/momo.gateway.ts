import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import axios from 'axios';
import {
    CreatePaymentRequest,
    CreatePaymentResponse,
    IPaymentGateway,
    IpnResponse,
    VerifyPaymentResponse,
} from '../../application/ports/payment-gateway.port';

@Injectable()
export class MomoGateway implements IPaymentGateway {
    constructor(private readonly config: ConfigService) { }

    private sign(data: string): string {
        return crypto
            .createHmac('sha256', process.env.MOMO_SECRET_KEY || '')
            .update(data)
            .digest('hex');
    }

    async createPayment(input: CreatePaymentRequest): Promise<CreatePaymentResponse> {
        const partnerCode = this.config.get('MOMO_PARTNER_CODE');
        const accessKey = this.config.get('MOMO_ACCESS_KEY');
        const redirectUrl = this.config.get('MOMO_RETURN_URL');
        const ipnUrl = this.config.get('MOMO_IPN_URL');
        const requestId = `${input.orderId}_${Date.now()}`;
        const requestType = 'payWithMethod';
        const extraData = '';

        const rawSignature = [
            `accessKey=${accessKey}`,
            `amount=${input.amount}`,
            `extraData=${extraData}`,
            `ipnUrl=${ipnUrl}`,
            `orderId=${input.orderId}`,
            `orderInfo=${input.orderInfo}`,
            `partnerCode=${partnerCode}`,
            `redirectUrl=${redirectUrl}`,
            `requestId=${requestId}`,
            `requestType=${requestType}`,
        ].join('&');

        const { data } = await axios.post(process.env.MOMO_API_URL || '', {
            partnerCode, accessKey, requestId,
            amount: input.amount,
            orderId: input.orderId,
            orderInfo: input.orderInfo,
            redirectUrl, ipnUrl, requestType,
            extraData, signature: this.sign(rawSignature), lang: 'vi',
        });

        return { paymentUrl: data.payUrl, orderId: input.orderId };
    }

    async verifyReturn(query: Record<string, any>): Promise<VerifyPaymentResponse> {
        const { orderId, amount, resultCode, transId, signature, ...rest } = query;
        const accessKey = this.config.get('MOMO_ACCESS_KEY');
        const partnerCode = this.config.get('MOMO_PARTNER_CODE');

        const rawSignature = [
            `accessKey=${accessKey}`,
            `amount=${amount}`,
            `extraData=${rest.extraData || ''}`,
            `message=${rest.message}`,
            `orderId=${orderId}`,
            `orderInfo=${rest.orderInfo}`,
            `orderType=${rest.orderType}`,
            `partnerCode=${partnerCode}`,
            `payType=${rest.payType}`,
            `requestId=${rest.requestId}`,
            `responseTime=${rest.responseTime}`,
            `resultCode=${resultCode}`,
            `transId=${transId}`,
        ].join('&');

        const success = this.sign(rawSignature) === signature && resultCode === '0';

        return {
            success,
            orderId,
            amount: parseInt(amount),
            providerTxnId: String(transId),
            rawData: JSON.stringify(query),
        };
    }

    async verifyIpn(body: Record<string, any>): Promise<IpnResponse> {
        const result = await this.verifyReturn(body);
        return result.success
            ? { code: '00', message: 'Success' }
            : { code: '99', message: 'Failed' };
    }
}