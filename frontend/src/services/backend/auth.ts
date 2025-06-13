import { Credentials, Role } from "@/contexts/AuthContext";
import {
  postApiAuthLogin,
  postApiAuthRefresh,
  PostApiAuthRefreshData,
  postApiAuthRevoke,
  TokenResponseDto,
} from "@/generated/client";
import { client } from "@/generated/client/client.gen";
import Cookies from "universal-cookie";

const REFRESH_ENDPOINT: PostApiAuthRefreshData["url"] = "/api/Auth/refresh";
const REFRESH_TOKEN_COOKIE = "refresh_token";

export interface Authentication {
  role: Role;
}

let authentication: (Authentication & { accessToken: string }) | null = null;

const cookies = new Cookies();
client.interceptors.request.use((options) => {
  let token: string | undefined;
  if (options.url.endsWith(REFRESH_ENDPOINT)) {
    token = cookies.get(REFRESH_TOKEN_COOKIE);
  } else {
    token = authentication?.accessToken;
  }
  if (token) {
    options.headers.set("Authorization", `Bearer ${token}`);
  }
  return options;
});

export async function authenticate(credentials: Credentials): Promise<Authentication | null> {
  const response = await postApiAuthLogin({ body: credentials });
  if (!response.data) {
    return null;
  }
  return handleTokenResponse(response.data);
}

export async function refresh(): Promise<Authentication | null> {
  if (!cookies.get(REFRESH_TOKEN_COOKIE)) {
    return null;
  }
  const response = await postApiAuthRefresh();
  if (!response.data) {
    authentication = null;
    cookies.remove(REFRESH_TOKEN_COOKIE);
    return null;
  }
  return handleTokenResponse(response.data);
}

function handleTokenResponse(response: TokenResponseDto): Authentication {
  authentication = {
    accessToken: response.accessToken!,
    role: response.role,
  };
  // TODO: HTTP Only
  cookies.set(REFRESH_TOKEN_COOKIE, response.refreshToken);
  return {
    role: authentication.role,
  };
}

export async function getAuthentication(): Promise<Authentication | null> {
  if (authentication === null) {
    await refresh();
  }
  if (authentication !== null) {
    return { role: authentication.role };
  }
  return null;
}

export async function deauthenticate() {
  await postApiAuthRevoke();
  authentication = null;
  cookies.remove(REFRESH_TOKEN_COOKIE);
}
