import { BaseConnector, ApiResponse } from './baseConnector';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: string;
  username: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email?: string;
}

export interface RegisterResponse {
  userId: string;
  username: string;
  message: string;
}

export class AuthConnector extends BaseConnector {
  async login(username: string, password: string): Promise<ApiResponse<LoginResponse>> {
    return this.post<LoginResponse>('/api/auth/login', {
      username,
      password,
    });
  }

  async register(
    username: string,
    password: string,
    email?: string
  ): Promise<ApiResponse<RegisterResponse>> {
    return this.post<RegisterResponse>('/api/auth/register', {
      username,
      password,
      email,
    });
  }

  async logout(): Promise<ApiResponse<{ message: string }>> {
    return this.post('/api/auth/logout', {});
  }

  async validateToken(token: string): Promise<ApiResponse<{ valid: boolean }>> {
    return this.post('/api/auth/validate', {
      token,
    });
  }
}

export const authConnector = new AuthConnector();
