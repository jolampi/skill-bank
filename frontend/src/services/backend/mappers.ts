import { UserSkillDto } from "@/generated/client";
import { UserSkill } from "@/types";

export function userSkillFromDto(userSkill: UserSkillDto): UserSkill {
  return {
    label: userSkill.label!,
    proficiency: userSkill.proficiency,
    experienceInYears: userSkill.experienceInYears,
    hidden: userSkill.hidden,
  };
}
