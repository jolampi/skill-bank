import {
  getApiSkills,
  getApiUsersCurrent,
  postApiAuthLogin,
  postApiAuthRefresh,
  PostApiAuthRefreshData,
  putApiUsersCurrent,
  TokenResponseDto,
} from "@/generated/client";
import Cookies from "universal-cookie";
import { client } from "@/generated/client/client.gen";

const REFRESH_ENDPOINT: PostApiAuthRefreshData["url"] = "/api/Auth/refresh";
const REFRESH_TOKEN_COOKIE = "refresh_token";

export interface Authentication {
  role: "Admin" | "Consultant" | "Sales";
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

export interface Credentials {
  username: string;
  password: string;
}

export async function authenticate(credentials: Credentials): Promise<Authentication | null> {
  const response = await postApiAuthLogin({ body: credentials });
  if (!response.data) {
    return null;
  }
  return handleTokenResponse(response.data);
}

export async function refresh(): Promise<Authentication | null> {
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

export function deauthenticate() {
  authentication = null;
  cookies.remove(REFRESH_TOKEN_COOKIE);
}

export interface UserDetails {
  username: string;
  skills: UserSkill[];
}

export interface UserSkill {
  label: string;
}

export async function getCurrentUserDetails(): Promise<UserDetails> {
  const response = await getApiUsersCurrent();
  return {
    username: response.data?.username ?? "N/A",
    skills: response.data?.skills?.map((x) => ({ label: x.label ?? "N/A" })) ?? [],
  };
}

export interface UpdateUserDetails {
  skills: UserSkill[];
}

export async function updateCurrentUserDetails(
  data: UpdateUserDetails,
): Promise<UpdateUserDetails> {
  await putApiUsersCurrent({ body: data });
  return getCurrentUserDetails();
}

export async function getAllSkills(): Promise<string[]> {
  const response = await getApiSkills();
  return response.data?.results?.map((x) => x.label ?? "N/A") ?? [];
}
