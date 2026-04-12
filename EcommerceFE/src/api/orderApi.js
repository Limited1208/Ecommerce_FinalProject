import baseUrl from "./config";

export const createOrderApi = ({ items, shippingAddress }) =>
    baseUrl.post("/orders", {
        items: items,
        ...(shippingAddress ? { shippingAddress } : {}),
    });

export const paymentOrderApi = (orderId, paymentMethod) =>
    baseUrl.post(`/payments/${paymentMethod.toUpperCase()}/create`, {
        orderId,
        provider: paymentMethod.toUpperCase(),
    }).then((res) => res.data);