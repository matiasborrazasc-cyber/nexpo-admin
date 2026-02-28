import { FAIR_API_BASE } from "./auth.service";

export async function uploadSpeakerImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('token');
    const response = await fetch(`${FAIR_API_BASE}/api/upload/speaker-image`, {
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

export interface SpeakerItem {
    uuid: string;
    name: string;
    email: string;
    whatsapp: string;
    instagram: string;
    twitter: string;
    picture: string;
    description: string;
    fair: string;
}

export interface SpeakersResponse {
    message: string;
    status: number;
    data: SpeakerItem[] | SpeakerItem | null;
}

export async function fetchSpeakers(): Promise<SpeakersResponse> {
    const token = localStorage.getItem('token');

    const response = await fetch(`${FAIR_API_BASE}/api/speakers`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });
    const result: SpeakersResponse = await response.json();

    if (result.status !== 200) {
        throw new Error(result.message || 'Error al obtener los speakers');
    }

    return result;
}

export async function getSpeaker(uuid: string): Promise<SpeakersResponse> {
    const token = localStorage.getItem('token');

    const response = await fetch(`${FAIR_API_BASE}/api/speakers/${uuid}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });

    const result: SpeakersResponse = await response.json();

    if (!response.ok || (result.status !== 200 && result.status !== undefined)) {
        throw new Error(result.message || 'Error al obtener el orador');
    }

    return result;
}


export async function createSpeakers(data: Omit<SpeakerItem, 'uuid' | 'fair'>): Promise<SpeakersResponse> {
    const response = await fetch(`${FAIR_API_BASE}/api/speakers`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
    });
    const result: SpeakersResponse = await response.json();

    if (result.status !== 200) {
        throw new Error(result.message || 'Error al crear el speaker');
    }

    return result;
}

export async function updateSpeaker(uuid: string, data: Omit<SpeakerItem, 'uuid' | 'fair'>): Promise<SpeakersResponse> {
    const response = await fetch(`${FAIR_API_BASE}/api/speakers/${uuid}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
    });

    const result: SpeakersResponse = await response.json();

    if (result.status !== 200) {
        throw new Error(result.message || 'Error al actualizar el speaker');
    }

    return result;
}

export async function deleteSpeaker(uuid: string): Promise<void> {
    const response = await fetch(`${FAIR_API_BASE}/api/speakers/${uuid}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
    });

    if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error((body as any).message || 'Error al eliminar el orador');
    }

    const result = await response.json().catch(() => ({ status: 200 }));
    if (result.status != null && result.status !== 200) {
        throw new Error(result.message || 'Error al eliminar el orador');
    }
}
