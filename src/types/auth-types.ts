// types/auth-types.ts

export interface User {
  id: string;
  email: string;
  role: "store_admin" | "customer" | "super_admin";
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterResponse {
  token: string;
  email: string;
}

export interface ResetPassResponse {
  token: string;
  email: string;
}

export interface VerifyResponse {
  status: string;
  message: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
export interface ApiError {
  message: string;
  statusCode?: number;
}
export interface RegisterFormStoreAdminValues {
  email: string;
}
export interface RegisterFormCustomerValues {
  email: string;
}
export interface ResetPassValues {
  email: string;
}
export interface LoginFormCustomerValues {
  email: string;
  password: string;
}
export interface VerifyAndSetPassValues {
  username: string;
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  confirmPassword: string;
}
export interface VerifyResetPassValues {
  oldPassword: string;
  password: string;
  confirmPassword: string;
}
export interface LoginFormStoreValues {
  email: string;
  password: string;
}
export interface LoginFormSuperValues {
  email: string;
  password: string;
}

export interface RegisterFormStoreAdminProps {
  onSubmit: (values: RegisterFormStoreAdminValues) => Promise<void>;
}
export interface RegisterFormCustomerProps {
  onSubmit: (values: RegisterFormCustomerValues) => Promise<void>;
}
export interface ResetPassProps {
  onSubmit: (values: ResetPassValues) => Promise<void>;
}
export interface LoginFormCustomerProps {
  onSubmit: (values: LoginFormCustomerValues) => Promise<void>;
  handleGoogleLogin: () => void;
}
export interface VerifyAndSetPassProps {
  onSubmit: (values: VerifyAndSetPassValues) => Promise<void>;
}
export interface VerifyAndResetPassProps {
  onSubmit: (values: VerifyResetPassValues) => Promise<void>;
}
export interface LoginFormStoreProps {
  onSubmit: (values: LoginFormStoreValues) => Promise<void>;
}
export interface LoginFormSuperProps {
  onSubmit: (values: LoginFormSuperValues) => Promise<void>;
}
