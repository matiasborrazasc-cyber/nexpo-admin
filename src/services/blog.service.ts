import { FAIR_API_BASE } from './auth.service';

export async function uploadBlogImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('token');
    const response = await fetch(`${FAIR_API_BASE}/api/upload/blog-image`, {
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

export interface ArticleItem {
    uuid: string;
    name: string;
    description: string;
    imagen: string;
    url: string;
    category: string;
    fair: string;
}

export interface BlogResponse {
    message: string;
    status: number;
    data: ArticleItem[] | ArticleItem | null;
}

export async function fetchBlog(): Promise<BlogResponse> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${FAIR_API_BASE}/api/articles`, {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    const result: BlogResponse = await response.json();
    if (result.status !== 200) {
        throw new Error((result as any).message || 'Error al obtener el blog');
    }
    return result;
}

export async function createArticle(data: {
    name: string;
    description: string;
    imagen: string;
    url?: string;
    category?: string;
}): Promise<BlogResponse> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${FAIR_API_BASE}/api/articles`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            name: data.name,
            description: data.description,
            imagen: data.imagen,
            url: data.url ?? '',
            category: data.category ?? '',
        }),
    });
    const result: BlogResponse = await response.json();
    if (result.status !== 200) {
        throw new Error((result as any).message || 'Error al crear el artículo');
    }
    return result;
}

export async function getArticle(uuid: string): Promise<BlogResponse> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${FAIR_API_BASE}/api/articles/${uuid}`, {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    const result: BlogResponse = await response.json();
    if (!response.ok || (result.status != null && result.status !== 200)) {
        throw new Error((result as any).message || 'Error al obtener el artículo');
    }
    return result;
}

export async function updateArticle(uuid: string, data: {
    name: string;
    description: string;
    imagen: string;
    url?: string;
    category?: string;
}): Promise<BlogResponse> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${FAIR_API_BASE}/api/articles/${uuid}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            name: data.name,
            description: data.description,
            imagen: data.imagen,
            url: data.url ?? '',
            category: data.category ?? '',
        }),
    });
    const result: BlogResponse = await response.json();
    if (result.status !== 200) {
        throw new Error((result as any).message || 'Error al actualizar el artículo');
    }
    return result;
}

export async function deleteArticle(uuid: string): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${FAIR_API_BASE}/api/articles/${uuid}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error((body as any).message || 'Error al eliminar el artículo');
    }
    const result = await response.json().catch(() => ({ status: 200 }));
    if (result.status != null && result.status !== 200) {
        throw new Error(result.message || 'Error al eliminar el artículo');
    }
}
