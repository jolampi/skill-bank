import { postApiAuthLogin } from "@/generated/client";
import Cookies from "universal-cookie";

const ACCESS_TOKEN_COOKIE = "access_token";

const cookies = new Cookies();

export interface Credentials {
  username: string;
  password: string;
}

export async function authenticate(credentials: Credentials): Promise<boolean> {
  const response = await postApiAuthLogin({ body: credentials });
  if (!response.data) {
    return false;
  }
  // TODO: Address security concerns properly
  cookies.set(ACCESS_TOKEN_COOKIE, response.data.accessToken);
  return true;
}

export function isAuthenticated() {
  return !!cookies.get(ACCESS_TOKEN_COOKIE);
}

export function deauthenticate() {
  cookies.remove(ACCESS_TOKEN_COOKIE);
}
