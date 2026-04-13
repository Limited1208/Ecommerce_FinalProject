import { Injectable } from "@nestjs/common";
import { CreatePaymentRequest, CreatePaymentResponse, IPaymentGateway, IpnResponse, VerifyPaymentResponse } from "../../application/ports/payment-gateway.port";
import { ConfigService } from "@nestjs/config";
import { hmacSha512, sortObject, toQueryString } from "./vnpay.util";

@Injectable()
export class VnpayGateway implements IPaymentGateway {
    constructor(private readonly config: ConfigService) { }

    async createPayment(request: CreatePaymentRequest): Promise<CreatePaymentResponse> {
        const vnd = request.amount * 26000;
        const ipAddr = request.ipAddr === '::1' ? '127.0.0.1' : request.ipAddr;

        const param = {
            vnp_Version: '2.1.0',
            vnp_Command: 'pay',
            vnp_TmnCode: this.config.get('VNPAY_TMN_CODE'),
            vnp_Amount: Math.round(vnd * 100),
            vnp_CurrCode: 'VND',
            vnp_TxnRef: request.orderId,
            vnp_OrderInfo: request.orderInfo,
            vnp_OrderType: 'other',
            vnp_Locale: 'en',
            vnp_ReturnUrl: this.config.get('VNPAY_RETURN_URL'),
            vnp_IpAddr: ipAddr,
            vnp_CreateDate: this.formatDate(new Date()),
            vnp_ExpireDate: this.formatDate(new Date(Date.now() + 15 * 60 * 1000)),
        };

        const signData = toQueryString(param);
        const secureHash = hmacSha512(this.config.get('VNPAY_HASH_SECRET')!, signData);
        const paymentUrl = `${this.config.get('VNPAY_URL')}?${signData}&vnp_SecureHash=${secureHash}`;

        return { paymentUrl, orderId: request.orderId };
    }

    async verifyReturn(query: Record<string, any>): Promise<VerifyPaymentResponse> {
        const {
            vnp_SecureHash,
            vnp_SecureHashType, // phải loại bỏ cả field này nếu có
            vnp_TxnRef,
            vnp_ResponseCode,
            vnp_Amount,
            vnp_TransactionNo,
            ...rest
        } = query;

        // Dùng cùng hàm toQueryString để đảm bảo encode nhất quán
        const checkHash = hmacSha512(
            this.config.get('VNPAY_HASH_SECRET')!,
            toQueryString(rest),
        );

        const success = checkHash === vnp_SecureHash && vnp_ResponseCode === '00';

        return {
            success,
            orderId: vnp_TxnRef,
            amount: parseInt(vnp_Amount) / 100,
            providerTxnId: vnp_TransactionNo,
            rawData: JSON.stringify(query),
        };
    }

    async verifyIpn(query: Record<string, any>): Promise<IpnResponse> {
        const {
            vnp_SecureHash,
            vnp_SecureHashType, // loại bỏ nếu có
            ...rest
        } = query;

        // Dùng cùng hàm toQueryString
        const checkHash = hmacSha512(
            this.config.get('VNPAY_HASH_SECRET')!,
            toQueryString(rest),
        );

        if (checkHash !== vnp_SecureHash) {
            return { code: '97', message: 'Invalid Checksum' };
        }

        return query.vnp_ResponseCode === '00'
            ? { code: '00', message: 'Payment successful' }
            : { code: '01', message: 'Payment failed' };
    }

    private formatDate(date: Date): string {
        const pad = (n: number) => n.toString().padStart(2, '0');
        return date.getFullYear().toString() +
            pad(date.getMonth() + 1) +
            pad(date.getDate()) +
            pad(date.getHours()) +
            pad(date.getMinutes()) +
            pad(date.getSeconds());
    }
}