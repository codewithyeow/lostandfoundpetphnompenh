export default interface User {
    user: User;
    access_token: any;
    id: number;
    role_id: number;
    name: string;
    email: string;
    avatar: string;
    email_verified_at: string | null;
    settings: any[];
    created_at: string;
    updated_at: string;
    role: {
        id: number;
        name: string;
        display_name: string;
        created_at: string;
        updated_at: string;
    };
}