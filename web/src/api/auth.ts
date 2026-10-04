import { apiClient } from './client';

export interface RegisterPayload {
  username: string;
  password: string;
  email: string;
  cep: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface AuthUser {
  username: string;
}

export async function register(payload: RegisterPayload): Promise<AuthUser> {
  await apiClient.post('/create', payload);
  return { username: payload.username };
}

export async function login(payload: LoginPayload): Promise<AuthUser> {
  await apiClient.post('/auth', payload);
  return { username: payload.username };
}
