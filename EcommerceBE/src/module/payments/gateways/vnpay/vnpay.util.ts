import * as crypto from 'crypto';
import * as qs from 'qs';

export function sortObject(obj: Record<string, any>): Record<string, any> {
    return Object.keys(obj)
        .sort()
        .reduce((acc, key) => ({ ...acc, [key]: obj[key] }), {});
}

export function hmacSha512(secretKey: string, data: string): string {
    return crypto.createHmac('sha512', secretKey).update(data).digest('hex');
}

export function toQueryString(params: Record<string, any>): string {
    return qs.stringify(sortObject(params), { encode: false });
}