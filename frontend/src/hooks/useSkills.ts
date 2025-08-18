import { useQuery } from "@tanstack/react-query";

import { getAllSkills } from "@/services/backend/skills";

const ONE_MINUTE = 1000 * 60;

export interface UseSkillsOptions {
  enabled: boolean;
}

export function useSkills(options?: UseSkillsOptions): ReadonlyArray<string> {
  const skills = useQuery({
    queryKey: ["skills"],
    queryFn: getAllSkills,
    enabled: options?.enabled,
    staleTime: ONE_MINUTE,
  });

  return skills.data ?? [];
}
