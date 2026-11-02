export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthToken {
  user_id: string;
  access_token: string;
}
