import { FAIR_API_BASE } from "./auth.service";

export interface ConfigResponse {
    message: string;
    status: number;
    data: { primaryColor: string } | null;
}

export async function fetchConfig(): Promise<ConfigResponse> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${FAIR_API_BASE}/api/config`, {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    const result: ConfigResponse = await response.json();
    if (result.status !== 200) {
        throw new Error((result as any).message || 'Error al obtener la configuración');
    }
    return result;
}

export async function updateConfig(primaryColor: string): Promise<ConfigResponse> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${FAIR_API_BASE}/api/config`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ primaryColor }),
    });
    const result: ConfigResponse = await response.json();
    if (result.status !== 200) {
        throw new Error((result as any).message || 'Error al actualizar la configuración');
    }
    return result;
}
