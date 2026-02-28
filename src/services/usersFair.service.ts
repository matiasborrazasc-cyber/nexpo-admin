import { FAIR_API_BASE } from "./auth.service";

export interface UsersFairItem {
    uuid: string;
    fair: string;
    user: string;
    name: string | null;
}

export interface UsersFairResponse {
    message: string;
    status: number;
    data: UsersFairItem[] | null;
}

export async function fetchUsersFair(): Promise<UsersFairResponse> {
    const token = localStorage.getItem('token');

    const response = await fetch(`${FAIR_API_BASE}/api/users/fair`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });

    const result: UsersFairResponse = await response.json();

    if (result.status !== 200) {
        throw new Error(result.message || 'Error al obtener la información de la feria');
    }

    return result;
}

