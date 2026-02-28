import { FAIR_API_BASE } from "./auth.service";

export interface DashboardStats {
    totalStands: number;
    totalClients: number;
    totalEvents: number;
    totalSpeakers: number;
    totalArticles: number;
    totalGiveaways: number;
    upcomingEvents: Array<{
        uuid: string;
        name: string;
        date: string;
        hour: string | null;
        place: string | null;
    }>;
}

export interface DashboardResponse {
    message: string;
    status: number;
    data: DashboardStats | null;
}

export async function fetchDashboardStats(): Promise<DashboardResponse> {
    const token = localStorage.getItem('token');

    const response = await fetch(`${FAIR_API_BASE}/api/dashboard/stats`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    const result: DashboardResponse = await response.json();

    if (result.status !== 200) {
        throw new Error(result.message || 'Error al cargar estadísticas');
    }

    return result;
}
