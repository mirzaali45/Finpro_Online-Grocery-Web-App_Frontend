// types/auth-types.ts

export interface User {
  user_id: number;
  email: string;
  username: string;
  phone: string;
  first_name: string;
  last_name: string;
  date_ob: string | null;
  avatar: string;
  google_id: string | null;
  role: "store_admin" | "customer" | "super_admin";
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  status: string;
  msg: string;
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  statusCode?: number;
}

// Form-related interfaces
export interface LoginFormCustomerValues {
  email: string;
  password: string;
}

export interface LoginFormStoreValues {
  email: string;
  password: string;
}

export interface LoginFormSuperValues {
  email: string;
  password: string;
}

export interface LoginFormStoreProps {
  onSubmit: (values: LoginFormStoreValues) => Promise<void>;
}

export interface LoginFormSuperProps {
  onSubmit: (values: LoginFormSuperValues) => Promise<void>;
}

export interface LoginFormCustomerProps {
  onSubmit: (values: LoginFormCustomerValues) => Promise<void>;
}
