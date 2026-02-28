import { FAIR_API_BASE } from "./auth.service";

export async function uploadStandImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('token');
    const response = await fetch(`${FAIR_API_BASE}/api/upload/stand-image`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
    });
    const result = await response.json();
    if (result.status !== 200 || !result.data?.url) {
        throw new Error(result.message || 'Error al subir la imagen');
    }
    return result.data.url;
}

export interface StandItem {
    uuid: string;
    name: string;
    description: string;
    portada: string;
    image: string;
    email: string;
    whatsapp: string;
    instagram: string;
    facebook: string;
    user: string;
    category: string;
    typeOfStand: string;
    fair: string;
}

export interface StandsResponse {
    message: string;
    status: number;
    data: StandItem[] | StandItem | null;
}

export async function fetchStands(): Promise<StandsResponse> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${FAIR_API_BASE}/api/stores`, {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    const result: StandsResponse = await response.json();
    if (result.status !== 200) {
        throw new Error((result as any).message || 'Error al obtener los stands');
    }
    return result;
}

export async function getStand(uuid: string): Promise<StandsResponse> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${FAIR_API_BASE}/api/stores/${uuid}`, {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    const result: StandsResponse = await response.json();
    if (!response.ok || (result.status != null && result.status !== 200)) {
        throw new Error((result as any).message || 'Error al obtener el stand');
    }
    return result;
}

export async function createStands(data: Omit<StandItem, 'uuid' | 'fair'>): Promise<StandsResponse> {
    const response = await fetch(`${FAIR_API_BASE}/api/stores`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
    });
    const result: StandsResponse = await response.json();
    if (result.status !== 200) {
        throw new Error((result as any).message || 'Error al crear el stand');
    }
    return result;
}

export async function updateStand(uuid: string, data: Omit<StandItem, 'uuid' | 'fair'>): Promise<StandsResponse> {
    const response = await fetch(`${FAIR_API_BASE}/api/stores/${uuid}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
    });
    const result: StandsResponse = await response.json();
    if (result.status !== 200) {
        throw new Error((result as any).message || 'Error al actualizar el stand');
    }
    return result;
}

export async function deleteStand(uuid: string): Promise<void> {
    const response = await fetch(`${FAIR_API_BASE}/api/stores/${uuid}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    });
    if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error((body as any).message || 'Error al eliminar el stand');
    }
    const result = await response.json().catch(() => ({ status: 200 }));
    if (result.status != null && result.status !== 200) {
        throw new Error(result.message || 'Error al eliminar el stand');
    }
}
