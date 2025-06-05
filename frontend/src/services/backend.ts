import {
  getApiSkills,
  getApiUsersCurrent,
  postApiAuthLogin,
  putApiUsersCurrent,
} from "@/generated/client";
import Cookies from "universal-cookie";
import { client } from "@/generated/client/client.gen";

const ACCESS_TOKEN_COOKIE = "access_token";

const cookies = new Cookies();
client.interceptors.request.use((options) => {
  const token = cookies.get(ACCESS_TOKEN_COOKIE);
  if (token) {
    options.headers.set("Authorization", `Bearer ${token}`);
  }
  return options;
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
