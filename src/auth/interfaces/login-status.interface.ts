export interface LoginStatus {
  accessToken: { token: string; expiresIn: number };
  refreshToken: { token: string; expiresIn: number };
}
