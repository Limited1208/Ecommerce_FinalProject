import * as crypto from 'crypto';

export function sortObject(obj: Record<string, any>): Record<string, any> {
    return Object.keys(obj)
        .sort()
        .reduce((acc, key) => ({ ...acc, [key]: obj[key] }), {});
}

export function hmacSha512(secretKey: string, data: string): string {
    return crypto.createHmac('sha512', secretKey).update(data).digest('hex');
}

export function toQueryString(params: Record<string, any>): string {
    const sorted = sortObject(params);
    // VNPay yêu cầu encode theo chuẩn này — KHÔNG dùng qs.stringify
    return Object.entries(sorted)
        .map(([key, value]) =>
            `${key}=${encodeURIComponent(String(value)).replace(/%20/g, '+')}`
        )
        .join('&');
}