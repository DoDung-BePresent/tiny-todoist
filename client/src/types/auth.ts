export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CredentialPayload {
  email: string;
  password: string;
}

export type LoginPayload = CredentialPayload;
export type RegisterPayload = CredentialPayload;

export interface AuthResponseData {
  user: User;
  accessToken: string;
}

export interface AuthResponse {
  message: string;
  data: AuthResponseData;
}
