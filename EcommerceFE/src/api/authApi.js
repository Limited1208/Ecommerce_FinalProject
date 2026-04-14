import baseUrl from "./config";

export const loginApi = (email, password) =>
    baseUrl.post("/auth/login", { email, password }).then((res) => res.data);

export const registerApi = (firstName, lastName, email, password) =>
    baseUrl
        .post("/auth/register", { firstName, lastName, email, password })
        .then((res) => res.data);

export const logoutApi = () =>
    baseUrl.post("/auth/logout").then((res) => res.data);

/** Stub — backend endpoint does not exist yet. */
export const forgotPasswordApi = (email) =>
    baseUrl.post("/auth/forgot-password", { email }).then((res) => res.data);
