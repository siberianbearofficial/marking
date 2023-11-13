export interface SignInResponseModel {
  access_token: string;
  token_type: string;
  sub: string;
  exp: number;
  is_admin: boolean;
}
