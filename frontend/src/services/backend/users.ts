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
  description: string;
  name: string;
  username: string;
  skills: UserSkill[];
}

export interface UserSkill {
  label: string;
  experienceInYears: number;
  hidden: boolean;
  proficiency: number;
}

export async function getCurrentUserDetails(): Promise<UserDetails> {
  const response = await getApiUsersCurrent();
  const data = response.data!;
  const skills = data.skills!.map<UserSkill>((x) => ({
    label: x.label!,
    experienceInYears: x.experienceInYears,
    hidden: x.hidden,
    proficiency: x.proficiency,
  }));
  return {
    description: data.description!,
    name: data.name!,
    username: data.username!,
    skills,
  };
}

export interface UpdateUserDetails {
  description: string;
  name: string;
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
  name: string;
  username: string;
  role: Role;
}

export async function getAllUsers(): Promise<User[]> {
  const response = await getApiUsers();
  return response.data!.results!.map((x) => ({
    id: x.id,
    name: x.name!,
    username: x.username!,
    role: x.role,
  }));
}

export interface NewUser {
  name: string;
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
