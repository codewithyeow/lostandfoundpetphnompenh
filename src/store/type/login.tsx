// src/store/type/login.ts
export interface LoginType {
    success: boolean;
    user?: any; 
    error?: string;
    status_description?: string;
    status: number;
    data?: any;
    error_message?: string;
}
