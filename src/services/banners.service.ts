import { FAIR_API_BASE } from './auth.service';

export async function uploadBannerImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('token');
    const response = await fetch(`${FAIR_API_BASE}/api/upload/banner-image`, {
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

export interface BannerItem {
    uuid: string;
    name: string;
    url: string;
    section: string;
    sponsor: string;
    fair: string;
    views?: number;
}

export interface BannersResponse {
    message: string;
    status: number;
    data: BannerItem[] | BannerItem | null;
}

export async function fetchBanners(): Promise<BannersResponse> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${FAIR_API_BASE}/api/bannerPublicity`, {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    const result: BannersResponse = await response.json();
    if (result.status !== 200) {
        throw new Error((result as any).message || 'Error al obtener los banners');
    }
    return result;
}

export async function getBanner(uuid: string): Promise<BannersResponse> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${FAIR_API_BASE}/api/bannerPublicity/${uuid}`, {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    const result: BannersResponse = await response.json();
    if (!response.ok || (result.status != null && result.status !== 200)) {
        throw new Error((result as any).message || 'Error al obtener el banner');
    }
    return result;
}

export async function createBanners(data: Omit<BannerItem, 'uuid' | 'fair'>): Promise<BannersResponse> {
    const response = await fetch(`${FAIR_API_BASE}/api/bannerPublicity`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
    });
    const result: BannersResponse = await response.json();
    if (result.status !== 200) {
        throw new Error((result as any).message || 'Error al crear el banner');
    }
    return result;
}

export async function updateBanner(uuid: string, data: Omit<BannerItem, 'uuid' | 'fair'>): Promise<BannersResponse> {
    const response = await fetch(`${FAIR_API_BASE}/api/bannerPublicity/${uuid}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
    });
    const result: BannersResponse = await response.json();
    if (result.status !== 200) {
        throw new Error((result as any).message || 'Error al actualizar el banner');
    }
    return result;
}

export async function deleteBanner(uuid: string): Promise<void> {
    const response = await fetch(`${FAIR_API_BASE}/api/bannerPublicity/${uuid}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    });
    if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error((body as any).message || 'Error al eliminar el banner');
    }
    const result = await response.json().catch(() => ({ status: 200 }));
    if (result.status != null && result.status !== 200) {
        throw new Error(result.message || 'Error al eliminar el banner');
    }
}
