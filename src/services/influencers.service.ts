import { FAIR_API_BASE } from "./auth.service";

export interface InfluencerItem {
    uuid: string;
    name: string;
    email: string;
    link: string;
    redirection: string;
    fair: string;
}

export interface InfluencersResponse {
    message: string;
    status: number;
    data: InfluencerItem[] | InfluencerItem | null;
}

export async function fetchInfluencers(): Promise<InfluencersResponse> {
    const token = localStorage.getItem('token');

    const response = await fetch(`${FAIR_API_BASE}/api/influencers`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });
    const result: InfluencersResponse = await response.json();

    if (result.status !== 200) {
        throw new Error(result.message || 'Error al obtener los influencers');
    }

    return result;
}

export async function getInfluencer(uuid: string): Promise<InfluencersResponse> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${FAIR_API_BASE}/api/influencers/${uuid}`, {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    const result: InfluencersResponse = await response.json();
    if (!response.ok || (result.status != null && result.status !== 200)) {
        throw new Error((result as any).message || 'Error al obtener el influencer');
    }
    return result;
}

export async function updateInfluencer(uuid: string, data: Omit<InfluencerItem, 'uuid' | 'fair'>): Promise<InfluencersResponse> {
    const response = await fetch(`${FAIR_API_BASE}/api/influencers/${uuid}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
    });
    const result: InfluencersResponse = await response.json();
    if (result.status !== 200) {
        throw new Error((result as any).message || 'Error al actualizar el influencer');
    }
    return result;
}

export async function createInfluencers(data: Omit<InfluencerItem, 'uuid' | 'fair'>): Promise<InfluencersResponse> {
    const response = await fetch(`${FAIR_API_BASE}/api/influencers`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
    });
    const result: InfluencersResponse = await response.json();

    if (result.status !== 200) {
        throw new Error(result.message || 'Error al crear el influencer');
    }

    return result;
}

export interface InfluencerViews {
    totalViews: number;
    dailyViews: { date: string; count: number }[];
}

export async function getInfluencerViews(uuid: string): Promise<{ message: string; status: number; data: InfluencerViews | null }> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${FAIR_API_BASE}/api/influencers/${uuid}/views`, {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    const result = await response.json();
    if (result.status !== 200) {
        throw new Error(result.message || 'Error al obtener las visitas');
    }
    return result;
}

export async function deleteInfluencer(uuid: string): Promise<InfluencersResponse> {
    const response = await fetch(`${FAIR_API_BASE}/api/influencers/${uuid}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
    });

    const result: InfluencersResponse = await response.json();

    if (result.status !== 200) {
        throw new Error(result.message || 'Error al eliminar el influencer');
    }

    return result;
}
