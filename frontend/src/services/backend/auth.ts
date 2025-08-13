"use server";

import { cookies } from "next/headers";

import { client } from "@/generated/client/client.gen";
import {
  postApiAuthLogin,
  postApiAuthRefresh,
  postApiAuthRevoke,
} from "@/generated/client/sdk.gen";
import { PostApiAuthRefreshData, TokenDto } from "@/generated/client/types.gen";

const REFRESH_ENDPOINT: PostApiAuthRefreshData["url"] = "/api/Auth/refresh";

const ACCESS_TOKEN_COOKIE = "access_token";
const REFRESH_TOKEN_COOKIE = "refresh_token";
const ROLE_TOKEN = "role";

client.interceptors.request.use(async (options) => {
  const cookiesProvider = await cookies();
  const cookieName = options.url.endsWith(REFRESH_ENDPOINT)
    ? REFRESH_TOKEN_COOKIE
    : ACCESS_TOKEN_COOKIE;
  const token = cookiesProvider.get(cookieName)?.value;
  if (token) {
    //@ts-expect-error: Wrong type
    options.headers.set("Authorization", `Bearer ${token}`);
  }
});

export interface Credentials {
  username: string;
  password: string;
}

export interface Authentication {
  role: Role;
}

export type Role = "Admin" | "Consultant" | "Sales";

export async function authenticate(credentials: Credentials): Promise<Authentication | null> {
  const response = await postApiAuthLogin({ body: credentials });
  if (!response.data) {
    return null;
  }
  return handleTokenResponse(response.data);
}

export async function isAuthenticated(): Promise<boolean> {
  const cookiesProvider = await cookies();
  return cookiesProvider.has(ACCESS_TOKEN_COOKIE);
}

export async function getRole(): Promise<Role | null> {
  const cookiesProvider = await cookies();
  const role = cookiesProvider.get(ROLE_TOKEN);
  if (role) {
    return role.value as Role;
  } else {
    return null;
  }
}

export async function refresh(): Promise<Authentication | null> {
  const cookiesProvider = await cookies();
  if (!cookiesProvider.get(REFRESH_TOKEN_COOKIE)) {
    return null;
  }
  const response = await postApiAuthRefresh();
  if (!response.data) {
    cookiesProvider.delete(REFRESH_TOKEN_COOKIE);
    return null;
  }
  return handleTokenResponse(response.data);
}

async function handleTokenResponse(response: TokenDto): Promise<Authentication> {
  const cookiesProvider = await cookies();
  cookiesProvider.set(ACCESS_TOKEN_COOKIE, response.accessToken!, {
    httpOnly: true,
    expires: minutesFromNow(10),
  });
  cookiesProvider.set(REFRESH_TOKEN_COOKIE, response.refreshToken!, {
    httpOnly: true,
    expires: minutesFromNow(60 * 24),
  });
  cookiesProvider.set(ROLE_TOKEN, response.role);
  return {
    role: response.role,
  };
}

function minutesFromNow(minutes: number): Date {
  return new Date(Date.now() + minutes * 1000);
}

export async function deauthenticate() {
  await postApiAuthRevoke();
  const cookiesProvider = await cookies();
  cookiesProvider.delete(ACCESS_TOKEN_COOKIE);
  cookiesProvider.delete(REFRESH_TOKEN_COOKIE);
  cookiesProvider.delete(ROLE_TOKEN);
}
