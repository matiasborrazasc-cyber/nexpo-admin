import { FAIR_API_BASE } from './auth.service';

export interface ClientItem {
    uuid: string;
    fair: string;
    user: string;
    name: string;
    email: string;
}

export interface ClientsResponse {
    message: string;
    status: number;
    data: ClientItem[] | null;
}

export async function fetchClients(): Promise<ClientsResponse> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${FAIR_API_BASE}/api/admin/users-fair`, {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    const result: ClientsResponse = await response.json();
    if (result.status !== 200) {
        throw new Error((result as any).message || 'Error al obtener los clientes');
    }
    return result;
}
