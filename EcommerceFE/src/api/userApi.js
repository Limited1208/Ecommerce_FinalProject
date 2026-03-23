import baseUrl from "./config";

export const getProfileApi = () =>
    baseUrl.get("/users/me").then((res) => res.data);

export const updateProfileApi = (data) => 
    baseUrl.patch("users/me", data).then((res) => res.data)

export const changePasswordApi = (currentPassword, newPassword) =>
    baseUrl.patch('/users/me/password', {currentPassword, newPassword}).then((res) => res.data)