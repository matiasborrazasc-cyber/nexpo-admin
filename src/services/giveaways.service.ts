import { FAIR_API_BASE } from './auth.service';

export interface GiveawayItem {
    uuid: string;
    date: string;
    hour: string;
    name: string;
    fair: string;
    picture: string;
    description: string;
}

export interface GiveawaysResponse {
    message: string;
    status: number;
    data: GiveawayItem[] | GiveawayItem | null;
}

export async function fetchGiveaways(): Promise<GiveawaysResponse> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${FAIR_API_BASE}/api/giveaways`, {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    const result: GiveawaysResponse = await response.json();
    if (result.status !== 200) {
        throw new Error((result as any).message || 'Error al obtener los sorteos');
    }
    return result;
}

export async function getGiveaway(uuid: string): Promise<GiveawaysResponse> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${FAIR_API_BASE}/api/giveaways/${uuid}`, {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    const result: GiveawaysResponse = await response.json();
    if (!response.ok || (result.status != null && result.status !== 200)) {
        throw new Error((result as any).message || 'Error al obtener el sorteo');
    }
    return result;
}

export async function createGiveaway(data: Omit<GiveawayItem, 'uuid' | 'fair'>): Promise<GiveawaysResponse> {
    const response = await fetch(`${FAIR_API_BASE}/api/giveaways`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
    });
    const result: GiveawaysResponse = await response.json();
    if (result.status !== 200) {
        throw new Error((result as any).message || 'Error al crear el sorteo');
    }
    return result;
}

export async function updateGiveaway(uuid: string, data: Omit<GiveawayItem, 'uuid' | 'fair'>): Promise<GiveawaysResponse> {
    const response = await fetch(`${FAIR_API_BASE}/api/giveaways/${uuid}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
    });
    const result: GiveawaysResponse = await response.json();
    if (result.status !== 200) {
        throw new Error((result as any).message || 'Error al actualizar el sorteo');
    }
    return result;
}

export async function deleteGiveaway(uuid: string): Promise<void> {
    const response = await fetch(`${FAIR_API_BASE}/api/giveaways/${uuid}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    });
    if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error((body as any).message || 'Error al eliminar el sorteo');
    }
    const result = await response.json().catch(() => ({ status: 200 }));
    if (result.status != null && result.status !== 200) {
        throw new Error(result.message || 'Error al eliminar el sorteo');
    }
}
