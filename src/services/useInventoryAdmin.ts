import {
  LoginFormValues,
  LoginResponse,
  ApiError,
  RegisterFormCustomerValues,
  RegisterResponse,
  VerifyAndSetPassValues,
  VerifyResponse,
  RegisterFormStoreAdminValues,
  ResetPassValues,
  ResetPassResponse,
  VerifyResetPassValues,
} from "../types/auth-types";

interface DecodedToken {
  id: string;
  email: string;
  role: string;
  exp: number;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BE;

const request = async <T>(
  endpoint: string,
  method: string,
  body?: object,
  auth: boolean = false
): Promise<T> => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (auth) headers.Authorization = `Bearer ${localStorage.getItem("token")}`;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const error: ApiError = await res.json();
    throw new Error(error.message || "Request failed");
  }
  return res.json();
};

export class AuthService {
  static async register(credentials: RegisterFormCustomerValues): Promise<RegisterResponse> {
    return request<RegisterResponse>("/auth/register", "POST", credentials);
  }

  static async registerStoreAdmin(credentials: RegisterFormStoreAdminValues): Promise<RegisterResponse> {
    return request<RegisterResponse>("/auth/register/store-admin", "POST", credentials);
  }

  static async verifyAndSetPass(credentials: VerifyAndSetPassValues): Promise<VerifyResponse> {
    return request<VerifyResponse>("/auth/verification", "POST", credentials, true);
  }

  static async resetPass(credentials: ResetPassValues): Promise<ResetPassResponse> {
    return request<ResetPassResponse>("/auth/reset-password", "POST", credentials);
  }

  static async verifyResetPass(credentials: VerifyResetPassValues): Promise<VerifyResponse> {
    return request<VerifyResponse>("/auth/verify/reset-password", "POST", credentials, true);
  }

  static async login(credentials: LoginFormValues): Promise<LoginResponse> {
    const data = await request<LoginResponse>("/auth/login", "POST", credentials);
    localStorage.setItem("is_login", "true");
    localStorage.setItem("token", data.token);
    return data;
  }

  static logout(): void {
    ["token", "is_login", "exp_token"].forEach((key) => localStorage.removeItem(key));
  }

  static async checkTokenVerifyEmailExp(): Promise<void> {
    return request<void>(`/auth/check-email-token/${localStorage.getItem("token")}`, "GET");
  }

  static getToken(): string | null {
    return localStorage.getItem("token");
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  static parseToken(): DecodedToken | null {
    try {
      const token = this.getToken();
      if (!token) return null;
      return JSON.parse(atob(token.split(".")[1])) as DecodedToken;
    } catch {
      this.logout();
      return null;
    }
  }
}
