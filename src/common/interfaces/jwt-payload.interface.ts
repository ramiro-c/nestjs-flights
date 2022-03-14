export interface IJwtPayload {
  sub: string;
  username: string;
}

export interface IValidateResponse {
  userId: string;
  username: string;
}
