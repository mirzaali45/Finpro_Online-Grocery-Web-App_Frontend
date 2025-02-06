import {
  LoginFormCustomerValues,
  LoginResponse,
  ApiError,
} from "../types/auth-types";

interface DecodedToken {
  id: string;
  email: string;
  role: string;
  exp: number;
}

const base_url_be = process.env.NEXT_PUBLIC_BASE_URL_BE;

export class AuthService {
  static async login(
    credentials: LoginFormCustomerValues
  ): Promise<LoginResponse> {
    try {
      const response = await fetch(`${base_url_be}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(credentials),
      });

      // Parse response once
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Login failed");
      }

      const data = responseData as LoginResponse;
      console.log("Login response:", data); // Debug log

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      if (data.user && data.user.user_id) {
        console.log("Setting user_id:", data.user.user_id); // Debug log
        localStorage.setItem("user_id", data.user.user_id.toString());
      }

      return data;
    } catch (error) {
      console.error("Login error:", error); // Debug error log
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  }

  static async logout(): Promise<void> {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id"); // Also remove user_id on logout
  }

  static getToken(): string | null {
    return localStorage.getItem("token");
  }

  static getUserId(): string | null {
    return localStorage.getItem("user_id");
  }

  static isAuthenticated(): boolean {
    const token = this.getToken();
    const userId = this.getUserId();
    return !!(token && userId);
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
