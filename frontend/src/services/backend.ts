import { postApiAuthLogin } from "@/generated/client";
import Cookies from "universal-cookie";
import { client } from "@/generated/client/client.gen";

const ACCESS_TOKEN_COOKIE = "access_token";

const cookies = new Cookies();
client.interceptors.request.use((options) => {
  const token = cookies.get(ACCESS_TOKEN_COOKIE);
  if (token && options.headers) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (options.headers as any).set("Authorization", `Bearer ${token}`);
  }
});
client.setConfig({
  auth: () => cookies.get(ACCESS_TOKEN_COOKIE),
});

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
