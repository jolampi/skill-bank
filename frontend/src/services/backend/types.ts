import { UserSkillDto } from "@/generated/client/types.gen";

export interface UserSkill {
  label: string;
  proficiency: number;
  experienceInYears: number;
  hidden: boolean;
}

export function userSkillFromDto(userSkill: UserSkillDto): UserSkill {
  return {
    label: userSkill.label!,
    proficiency: userSkill.proficiency,
    experienceInYears: userSkill.experienceInYears,
    hidden: userSkill.hidden,
  };
}
