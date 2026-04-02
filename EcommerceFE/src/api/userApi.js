import baseUrl from "./config";

function firstArray(payload, keys) {
    if (Array.isArray(payload)) return payload;
    if (!payload || typeof payload !== "object") return [];
    for (const k of keys) {
        if (Array.isArray(payload[k])) return payload[k];
    }
    return [];
}

export const getProfileApi = () =>
    baseUrl.get("/users/me").then((res) => res.data);

export const updateProfileApi = (data) => 
    baseUrl.patch("users/me", data).then((res) => res.data)

export const changePasswordApi = (currentPassword, newPassword) =>
    baseUrl.patch('/users/me/password', {currentPassword, newPassword}).then((res) => res.data)

export async function getMyOrdersApi() {
    try {
        const { data } = await baseUrl.get("/orders/user/all", { params: { limit: 10, page: 1 } });
        console.log(data)
        return firstArray(data.data, ["orders", "content", "items", "data"]);
    } catch {
        return [];
    }
}

export async function deleteAccountApi() {
    await baseUrl.delete("/users/me");
}