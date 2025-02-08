// types/auth-types.ts

export interface User {
<<<<<<< HEAD
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

=======
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
>>>>>>> 62c2c231c94f84dc4574bf680ec2ffc3b2ccc68a
export interface ApiError {
  message: string;
  statusCode?: number;
}
<<<<<<< HEAD

// Form-related interfaces
=======
export interface RegisterFormStoreAdminValues {
  email: string;
}
export interface RegisterFormCustomerValues {
  email: string;
}
export interface ResetPassValues {
  email: string;
}
>>>>>>> 62c2c231c94f84dc4574bf680ec2ffc3b2ccc68a
export interface LoginFormCustomerValues {
  email: string;
  password: string;
}
<<<<<<< HEAD

=======
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
>>>>>>> 62c2c231c94f84dc4574bf680ec2ffc3b2ccc68a
export interface LoginFormStoreValues {
  email: string;
  password: string;
}
<<<<<<< HEAD

=======
>>>>>>> 62c2c231c94f84dc4574bf680ec2ffc3b2ccc68a
export interface LoginFormSuperValues {
  email: string;
  password: string;
}

<<<<<<< HEAD
export interface LoginFormStoreProps {
  onSubmit: (values: LoginFormStoreValues) => Promise<void>;
}

export interface LoginFormSuperProps {
  onSubmit: (values: LoginFormSuperValues) => Promise<void>;
}

export interface LoginFormCustomerProps {
  onSubmit: (values: LoginFormCustomerValues) => Promise<void>;
}
=======
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
>>>>>>> 62c2c231c94f84dc4574bf680ec2ffc3b2ccc68a
