import api from "../../../services/api";

export interface LoginResponse {
    success: boolean;
    message: string;
    ip?: string;
    voucher?: string;
}

export async function loginVoucher(voucher: string) {
    const res = await api.post<LoginResponse>(
        "/captive/login",
        {
            voucher,
        }
    );

    return res.data;
}