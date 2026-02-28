import { FAIR_API_BASE } from './auth.service';

export interface CuponItem {
    uuid: string;
    description: string;
    title: string;
    picture: string;
    fair: string;
}

export interface CuponsResponse {
    message: string;
    status: number;
    data: CuponItem[] | CuponItem | null;
}

export async function fetchCupons(): Promise<CuponsResponse> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${FAIR_API_BASE}/api/cupons`, {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    const result: CuponsResponse = await response.json();
    if (result.status !== 200) {
        throw new Error((result as any).message || 'Error al obtener los cupones');
    }
    return result;
}

export async function getCupon(uuid: string): Promise<CuponsResponse> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${FAIR_API_BASE}/api/cupons/${uuid}`, {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    const result: CuponsResponse = await response.json();
    if (!response.ok || (result.status != null && result.status !== 200)) {
        throw new Error((result as any).message || 'Error al obtener el cupón');
    }
    return result;
}

export async function createCupons(data: Omit<CuponItem, 'uuid' | 'fair'>): Promise<CuponsResponse> {
    const response = await fetch(`${FAIR_API_BASE}/api/cupons`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
    });
    const result: CuponsResponse = await response.json();
    if (result.status !== 200) {
        throw new Error((result as any).message || 'Error al crear el cupón');
    }
    return result;
}

export async function updateCupon(uuid: string, data: Omit<CuponItem, 'uuid' | 'fair'>): Promise<CuponsResponse> {
    const response = await fetch(`${FAIR_API_BASE}/api/cupons/${uuid}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
    });
    const result: CuponsResponse = await response.json();
    if (result.status !== 200) {
        throw new Error((result as any).message || 'Error al actualizar el cupón');
    }
    return result;
}

export async function deleteCupon(uuid: string): Promise<void> {
    const response = await fetch(`${FAIR_API_BASE}/api/cupons/${uuid}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    });
    if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error((body as any).message || 'Error al eliminar el cupón');
    }
    const result = await response.json().catch(() => ({ status: 200 }));
    if (result.status != null && result.status !== 200) {
        throw new Error(result.message || 'Error al eliminar el cupón');
    }
}
