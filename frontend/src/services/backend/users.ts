import { Role } from "@/contexts/AuthContext";
import {
  deleteApiUsersById,
  getApiSkills,
  getApiUsers,
  getApiUsersCurrent,
  postApiUsers,
  putApiUsersCurrent,
} from "@/generated/client";

export interface UserDetails {
  username: string;
  skills: UserSkill[];
}

export interface UserSkill {
  label: string;
  proficiency: number;
}

export async function getCurrentUserDetails(): Promise<UserDetails> {
  const response = await getApiUsersCurrent();
  const skills =
    response.data?.skills?.map((x) => ({
      label: x.label ?? "N/A",
      proficiency: x.proficiency,
    })) ?? [];
  return {
    username: response.data?.username ?? "N/A",
    skills,
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
