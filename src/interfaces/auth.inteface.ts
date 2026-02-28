export interface Admin {
    email: string;
    password: string;
}

/** Usuario admin devuelto por el backend Fair (POST /api/admin/login) */
export interface AdminUser {
    uuid: string;
    name: string;
    email: string;
    role: string;
    fair: string | null;
}