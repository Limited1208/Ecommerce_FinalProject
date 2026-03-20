import baseUrl from "./config";

export const loginApi = (email, password) =>
    baseUrl.post("/auth/login", { email, password }).then((res) => res.data);

export const registerApi = (firstName, lastName, email, password) =>
    baseUrl
        .post("/auth/register", { firstName, lastName, email, password })
        .then((res) => res.data);

export const logoutApi = (userId) =>
    baseUrl.post("/auth/logout", { userId }).then((res) => res.data);
