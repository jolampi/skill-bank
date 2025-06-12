import {
  deleteApiUsersById,
  getApiSkills,
  getApiUsers,
  getApiUsersCurrent,
  postApiAuthLogin,
  postApiAuthRefresh,
  PostApiAuthRefreshData,
  postApiAuthRevoke,
  postApiUsers,
  putApiUsersCurrent,
  TokenResponseDto,
} from "@/generated/client";
import Cookies from "universal-cookie";
import { client } from "@/generated/client/client.gen";
import { Credentials, Role } from "@/contexts/AuthContext";

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

export interface User {
  id: string;
  username: string;
  role: Role;
}

export async function getAllUsers(): Promise<User[]> {
  const response = await getApiUsers();
  return (
    response.data?.results?.map((x) => ({
      id: x.id,
      username: x.username!,
      role: x.role,
    })) ?? []
  );
}

export interface NewUser {
  username: string;
  password: string;
  role: Role;
}

export async function createUser(newUser: NewUser): Promise<void> {
  await postApiUsers({ body: newUser });
}

export async function deleteUser(id: string): Promise<void> {
  await deleteApiUsersById({ path: { id } });
}
