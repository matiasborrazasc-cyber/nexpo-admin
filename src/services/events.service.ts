import { FAIR_API_BASE } from './auth.service';

export async function uploadEventImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('token');
    const response = await fetch(`${FAIR_API_BASE}/api/upload/event-image`, {
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

export interface EventItem {
    uuid: string;
    date: string;
    hour: string;
    name: string;
    link: string;
    description: string;
    picture: string;
    people: string;
    fair: string;
    place: string;
}

export interface EventsResponse {
    message: string;
    status: number;
    data: EventItem[] | EventItem | null;
}

export async function fetchEvents(): Promise<EventsResponse> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${FAIR_API_BASE}/api/events`, {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    const result: EventsResponse = await response.json();
    if (result.status !== 200) {
        throw new Error((result as any).message || 'Error al obtener los eventos');
    }
    return result;
}

export async function getEvent(uuid: string): Promise<EventsResponse> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${FAIR_API_BASE}/api/events/${uuid}`, {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    const result: EventsResponse = await response.json();
    if (!response.ok || (result.status != null && result.status !== 200)) {
        throw new Error((result as any).message || 'Error al obtener el evento');
    }
    return result;
}

export async function createEvent(data: Omit<EventItem, 'uuid' | 'fair'>): Promise<EventsResponse> {
    const response = await fetch(`${FAIR_API_BASE}/api/events`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
    });
    const result: EventsResponse = await response.json();
    if (result.status !== 200) {
        throw new Error((result as any).message || 'Error al crear el evento');
    }
    return result;
}

export async function updateEvent(uuid: string, data: Omit<EventItem, 'uuid' | 'fair'>): Promise<EventsResponse> {
    const response = await fetch(`${FAIR_API_BASE}/api/events/${uuid}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
    });
    const result: EventsResponse = await response.json();
    if (result.status !== 200) {
        throw new Error((result as any).message || 'Error al actualizar el evento');
    }
    return result;
}

export async function deleteEvent(uuid: string): Promise<void> {
    const response = await fetch(`${FAIR_API_BASE}/api/events/${uuid}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    });
    if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error((body as any).message || 'Error al eliminar el evento');
    }
    const result = await response.json().catch(() => ({ status: 200 }));
    if (result.status != null && result.status !== 200) {
        throw new Error(result.message || 'Error al eliminar el evento');
    }
}
