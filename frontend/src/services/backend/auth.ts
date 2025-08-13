"use server";

import { cookies } from "next/headers";

import {
  postApiAuthLogin,
  postApiAuthRefresh,
  PostApiAuthRefreshData,
  TokenDto,
  postApiAuthRevoke,
} from "@/generated/client";
import { client } from "@/generated/client/client.gen";

const REFRESH_ENDPOINT: PostApiAuthRefreshData["url"] = "/api/Auth/refresh";

const ACCESS_TOKEN_COOKIE = "access_token";
const REFRESH_TOKEN_COOKIE = "refresh_token";
const ROLE_TOKEN = "role";

client.interceptors.request.use(async (options) => {
  const cookieStore = await cookies();
  const cookieName = options.url.endsWith(REFRESH_ENDPOINT)
    ? REFRESH_TOKEN_COOKIE
    : ACCESS_TOKEN_COOKIE;
  const token = cookieStore.get(cookieName)?.value;
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

export async function authenticate(credentials: Credentials): Promise<boolean> {
  const response = await postApiAuthLogin({ body: credentials });
  if (!response.data) {
    return false;
  }
  await handleTokenResponse(response.data);
  return true;
}

export async function refresh(): Promise<boolean> {
  const cookieStore = await cookies();
  if (!cookieStore.get(REFRESH_TOKEN_COOKIE)) {
    return false;
  }
  const response = await postApiAuthRefresh();
  if (!response.data) {
    cookieStore.delete(REFRESH_TOKEN_COOKIE);
    return false;
  }
  await handleTokenResponse(response.data);
  return true;
}

async function handleTokenResponse(response: TokenDto): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ACCESS_TOKEN_COOKIE, response.accessToken!, {
    expires: minutesFromNow(10),
    httpOnly: true,
  });
  cookieStore.set(REFRESH_TOKEN_COOKIE, response.refreshToken!, {
    expires: minutesFromNow(60 * 24),
    httpOnly: true,
  });
  cookieStore.set(ROLE_TOKEN, response.role);
}

function minutesFromNow(minutes: number): Date {
  return new Date(Date.now() + minutes * 60000);
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.has(ACCESS_TOKEN_COOKIE);
}

export async function getRole(): Promise<Role | null> {
  const cookieStore = await cookies();
  const role = cookieStore.get(ROLE_TOKEN);
  if (role) {
    return role.value as Role;
  } else {
    return null;
  }
}

export async function deauthenticate() {
  await postApiAuthRevoke();
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
  cookieStore.delete(ROLE_TOKEN);
}
