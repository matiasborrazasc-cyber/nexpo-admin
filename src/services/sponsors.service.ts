import { FAIR_API_BASE } from './auth.service';

export async function uploadSponsorImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('token');
    const response = await fetch(`${FAIR_API_BASE}/api/upload/sponsor-image`, {
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

export interface SponsorItem {
    uuid: string;
    name: string;
    description: string;
    image: string;
    email: string;
    phone: string;
    fair: string;
}

export interface SponsorsResponse {
    message: string;
    status: number;
    data: SponsorItem[] | SponsorItem | null;
}

export async function fetchSponsors(): Promise<SponsorsResponse> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${FAIR_API_BASE}/api/sponsors`, {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    const result: SponsorsResponse = await response.json();
    if (result.status !== 200) {
        throw new Error((result as any).message || 'Error al obtener sponsors');
    }
    return result;
}

export async function getSponsor(uuid: string): Promise<SponsorsResponse> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${FAIR_API_BASE}/api/sponsors/${uuid}`, {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    const result: SponsorsResponse = await response.json();
    if (!response.ok || (result.status != null && result.status !== 200)) {
        throw new Error((result as any).message || 'Error al obtener el sponsor');
    }
    return result;
}

export async function createSponsors(data: Omit<SponsorItem, 'uuid' | 'fair'>): Promise<SponsorsResponse> {
    const response = await fetch(`${FAIR_API_BASE}/api/sponsors`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
    });
    const result: SponsorsResponse = await response.json();
    if (result.status !== 200) {
        throw new Error((result as any).message || 'Error al crear el sponsor');
    }
    return result;
}

export async function updateSponsor(uuid: string, data: Omit<SponsorItem, 'uuid' | 'fair'>): Promise<SponsorsResponse> {
    const response = await fetch(`${FAIR_API_BASE}/api/sponsors/${uuid}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
    });
    const result: SponsorsResponse = await response.json();
    if (result.status !== 200) {
        throw new Error((result as any).message || 'Error al actualizar el sponsor');
    }
    return result;
}

export async function deleteSponsor(uuid: string): Promise<void> {
    const response = await fetch(`${FAIR_API_BASE}/api/sponsors/${uuid}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    });
    if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error((body as any).message || 'Error al eliminar el sponsor');
    }
    const result = await response.json().catch(() => ({ status: 200 }));
    if (result.status != null && result.status !== 200) {
        throw new Error(result.message || 'Error al eliminar el sponsor');
    }
}
