import { Injectable } from "@nestjs/common";
import { CreatePaymentRequest, CreatePaymentResponse, IPaymentGateway, IpnResponse, VerifyPaymentResponse } from "../../application/ports/payment-gateway.port";
import { ConfigService } from "@nestjs/config";
import { hmacSha512, sortObject, toQueryString } from "./vnpay.util";
import * as qs from 'qs';

@Injectable()
export class VnpayGateway implements IPaymentGateway {
    constructor(private readonly config: ConfigService) { }

    async createPayment(request: CreatePaymentRequest): Promise<CreatePaymentResponse> {
        const param = {
            vnp_Version: '2.1.0',
            vnp_Command: 'pay',
            vnp_TmnCode: this.config.get('VNPAY_TMN_CODE'),
            vnp_Amount: Math.round(request.amount) * 26000, // Convert USD to VND
            vnp_CurrCode: 'VND',
            vnp_TxnRef: request.orderId,
            vnp_OrderInfo: request.orderInfo,
            vnp_OrderType: 'other',
            vnp_Locale: 'en',
            vnp_ReturnUrl: this.config.get('VNPAY_RETURN_URL'),
            vnp_IpAddr: request.ipAddr,
            vnp_CreateDate: Date.now().toString(),
            vnp_ExpireDate: (Date.now() + 15 * 60 * 1000).toString(), // 15 minutes expiration
        };

        const signData = toQueryString(param);
        const secureHash = hmacSha512(this.config.get('VNPAY_HASH_SECRET')!, signData);
        const paymentUrl = `${this.config.get('VNPAY_URL')}?${signData}&vnp_SecureHash=${secureHash}`;

        return { paymentUrl, orderId: request.orderId };
    };

    async verifyReturn(query: Record<string, any>): Promise<VerifyPaymentResponse> {
        const {vnp_SecureHash, vnp_TxnRef, vnp_ResponseCode, vnp_Amount, vnp_TransactionNo, ...rest} = query;

        const checkHasj = hmacSha512(this.config.get('VNPAY_HASH_SECRET')!, qs.stringify(sortObject(rest), { encode: false }));

        const success = checkHasj === vnp_SecureHash && vnp_ResponseCode === '00';

        return{
            success,
            orderId: vnp_TxnRef,
            amount: parseInt(vnp_Amount) / 100,
            providerTxnId: vnp_TransactionNo,
            rawData: JSON.stringify(query),
        }
    }

    async verifyIpn(query: Record<string, any>): Promise<IpnResponse> {
        const {vnp_SecureHash, ...rest} = query;

        const checkHash = hmacSha512(this.config.get('VNPAY_HASH_SECRET')!, qs.stringify(sortObject(rest), { encode: false }));
        if(checkHash === vnp_SecureHash){
            if(query.vnp_ResponseCode === '00'){
                return { code: '00', message: 'Payment successful' };
            } else {
                return { code: '01', message: 'Payment failed' };
            }
        } else {
            return { code: '97', message: 'Invalid Checksum' };
        }
    }
}