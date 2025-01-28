// types/user-types.ts

export interface User {
  user_id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  role: string;
  phone: string;
  verified: boolean;
  created_at: string;
}

export interface ApiUserResponse {
  status: string;
  data: User[];
}
