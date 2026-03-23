import type { Admin } from "../interfaces/auth.inteface";

/** URL de la API. Prod: https://managment.nexpo.uy. Dev: localhost. Ver .env.production */
const envApi = import.meta.env.VITE_API_URL;
export const FAIR_API_BASE =
  envApi !== undefined && envApi !== ''
    ? envApi
    : import.meta.env.DEV
      ? 'http://localhost:3000'
      : '';

export interface LoginResponse {
    message: string;
    status: number;
    data: {
        token: string;
        user: {
            uuid: string;
            name: string;
            email: string;
            role: string;
            fair: string | null;
        };
    } | null;
}

export async function login(data: Admin): Promise<LoginResponse> {
    const response = await fetch(`${FAIR_API_BASE}/api/admin/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    const result: LoginResponse = await response.json();

    if (result.status !== 200 || !result.data?.token || !result.data?.user) {
        throw new Error(result.message || 'Email o contraseña inválida');
    }
    return result;
}