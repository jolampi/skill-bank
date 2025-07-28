import { userSkillFromDto } from "./mappers";

import { Role } from "@/contexts/AuthContext";
import {
  deleteApiUsersById,
  getApiSkills,
  getApiUsers,
  getApiUsersCurrent,
  postApiUsers,
  putApiUsersCurrent,
  UserDetailsDto,
} from "@/generated/client";
import { UserSkill } from "@/types";

export interface UserDetails {
  id: string;
  username: string;
  name: string;
  description: string;
  skills: UserSkill[];
}

function userDetailsFromDto(userDetails: UserDetailsDto): UserDetails {
  return {
    id: userDetails.id,
    username: userDetails.username!,
    name: userDetails.name!,
    description: userDetails.description!,
    skills: userDetails.skills!.map(userSkillFromDto),
  };
}

export async function getCurrentUserDetails(): Promise<UserDetails> {
  const response = await getApiUsersCurrent();
  return userDetailsFromDto(response.data!);
}

export interface UpdateUserDetails {
  description: string;
  name: string;
  skills: UserSkill[];
}

export async function updateCurrentUserDetails(
  data: UpdateUserDetails,
): Promise<UpdateUserDetails> {
  await putApiUsersCurrent({ body: { ...data, title: "" } });
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
