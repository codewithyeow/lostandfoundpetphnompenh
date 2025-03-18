// Update ApiResponse interface to match your API response structure
export interface ApiResponse<T> {
    status: number;
    success: boolean;
    title: string;
    code: number;
    message: string;
    result?: T;
}

export interface LoginResponse {
    token_type: string;
    access_token: string;
    expires_in: number;
    user: {
        id: number;
        role_id: number;
        name: string;
        email: string;
        avatar: string;
        email_verified_at: string | null;
        settings: any[]; // Modify if necessary
        created_at: string;
        updated_at: string;
        role: {
            id: number;
            name: string;
            display_name: string;
            created_at: string;
            updated_at: string;
        };
    };
}


export interface ErrorResponse {
    errors: Record<string, string[]>;
}
