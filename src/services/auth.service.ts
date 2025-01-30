// services/auth.service.ts
import { LoginFormValues, LoginResponse, ApiError } from "../types/auth-types";

interface DecodedToken {
  id: string;
  email: string;
  role: string;
  exp: number;
}

const base_url_be = process.env.NEXT_PUBLIC_BASE_URL_BE;

export class AuthService {
  static async login(credentials: LoginFormValues): Promise<LoginResponse> {
    try {
      const response = await fetch(`${base_url_be}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = (await response.json()) as ApiError;
        throw new Error(error.message || "Login failed");
      }

      const data = (await response.json()) as LoginResponse;

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  }

  static async logout(): Promise<void> {
    localStorage.removeItem("token");
  }

  static getToken(): string | null {
    return localStorage.getItem("token");
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  static parseToken(): DecodedToken | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const [, payloadB64] = token.split(".");
      if (!payloadB64) return null;

      const payload = JSON.parse(atob(payloadB64));
      return payload as DecodedToken;
    } catch {
      // If token parsing fails, clear it
      this.logout();
      return null;
    }
  }
}
