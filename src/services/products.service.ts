import { FAIR_API_BASE } from './auth.service';

export interface ProductItem {
    uuid: string;
    title: string;
    description: string;
    image: string;
    price: number;
    currency: string;
    category: string;
    store: string;
    fair: string;
}

export interface ProductCategoryItem {
    uuid: string;
    name: string;
    store: string;
    fair: string;
}

export async function uploadProductImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('token');
    const response = await fetch(`${FAIR_API_BASE}/api/upload/product-image`, {
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

export async function fetchProductsByStore(storeUuid: string): Promise<Record<string, ProductItem[]>> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${FAIR_API_BASE}/api/products/by-store/${storeUuid}`, {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    const result = await response.json();
    if (result.status !== 200) {
        throw new Error((result as any).message || 'Error al obtener productos');
    }
    return result.data || {};
}

export async function createProduct(data: Omit<ProductItem, 'uuid'>): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${FAIR_API_BASE}/api/products`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    const result = await response.json();
    if (result.status !== 200) {
        throw new Error((result as any).message || 'Error al crear producto');
    }
}

export async function updateProduct(uuid: string, data: Omit<ProductItem, 'uuid'>): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${FAIR_API_BASE}/api/products/${uuid}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    const result = await response.json();
    if (result.status !== 200) {
        throw new Error((result as any).message || 'Error al actualizar producto');
    }
}

export async function deleteProduct(uuid: string): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${FAIR_API_BASE}/api/products/${uuid}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
    });
    const result = await response.json().catch(() => ({ status: 200 }));
    if (result.status !== 200) {
        throw new Error((result as any).message || 'Error al eliminar producto');
    }
}

export async function fetchCategoriesByStore(storeUuid: string): Promise<ProductCategoryItem[]> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${FAIR_API_BASE}/api/products-categories/by-store/${storeUuid}`, {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    const result = await response.json();
    if (result.status !== 200) {
        throw new Error((result as any).message || 'Error al obtener categorías');
    }
    return result.data || [];
}

export async function createCategory(data: Omit<ProductCategoryItem, 'uuid'>): Promise<ProductCategoryItem> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${FAIR_API_BASE}/api/products-categories`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    const result = await response.json();
    if (result.status !== 200) {
        throw new Error((result as any).message || 'Error al crear categoría');
    }
    return result.data as ProductCategoryItem;
}
