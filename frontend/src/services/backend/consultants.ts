import { UserSkill, userSkillFromDto } from "./types";

import { ConsultantListDto, postApiConsultants } from "@/generated/client";

export interface SkillFilter {
  label: string;
  proficiency: number;
  experienceInYears: number;
}

export interface Consultant {
  id: string;
  name: string;
  skills: UserSkill[];
}

function consultantFromDto(consultant: ConsultantListDto): Consultant {
  return {
    id: consultant.id,
    name: consultant.name!,
    skills: consultant.skills!.map(userSkillFromDto),
  };
}

export async function findConsultants(filters: SkillFilter[]): Promise<Consultant[]> {
  const response = await postApiConsultants({ body: { skills: filters } });
  return response.data!.results!.map(consultantFromDto);
}
