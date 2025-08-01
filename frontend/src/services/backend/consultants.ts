import { userSkillFromDto } from "./mappers";

import { ConsultantDto, postApiConsultants, UserSkillFilterDto } from "@/generated/client";
import { UserSkill } from "@/types";

export interface SkillFilter extends Required<UserSkillFilterDto> {
  label: string;
}

export interface Consultant {
  id: string;
  name: string;
  title: string;
  skills: UserSkill[];
}

function consultantFromDto(consultant: ConsultantDto): Consultant {
  return {
    id: consultant.id,
    name: consultant.name!,
    title: consultant.title!,
    skills: consultant.skills!.map(userSkillFromDto),
  };
}

export async function findConsultants(filters: SkillFilter[]): Promise<Consultant[]> {
  const response = await postApiConsultants({ body: { skills: filters } });
  return response.data!.results!.map(consultantFromDto);
}
