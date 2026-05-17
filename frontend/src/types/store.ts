import { User } from "./user";

export interface AuthState {
    accessToken: string | null;
    user: User | null;
    loading: boolean;

    setAccessToken: (accessToken: string) => void;

    // Xóa state
    clearState: () => void;

    // Đăng ký
    signUp: (
        username:string,
        email:string,
        password:string,
        firstName:string,
        lastName:string) => Promise<void>

    // Đăng nhập
    signIn: (
        username:string,
        password:string) => Promise<void>

    // Đăng xuất
    signOut: () => Promise<void>;

    fetchMe: () => Promise<void>;

    refresh: () => Promise<void>;
    
}