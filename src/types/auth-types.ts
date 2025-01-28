// types/auth-types.ts

export interface User {
  id: string;
  email: string;
  role: "store_admin" | "customer" | "super_admin";
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  statusCode?: number;
}

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => Promise<void>;
}
