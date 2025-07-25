import { userSkillFromDto } from "./mappers";

import { ConsultantListDto, postApiConsultants, UserSkillFilterDto } from "@/generated/client";
import { UserSkill } from "@/types";

export interface SkillFilter extends Required<UserSkillFilterDto> {
  label: string;
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
