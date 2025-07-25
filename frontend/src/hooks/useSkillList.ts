import { useEffect, useState } from "react";

import { getAllSkills } from "@/services/backend";

export default function useSkillList(fetch: boolean): string[] {
  const [skills, setSkills] = useState<string[]>([]);

  useEffect(() => {
    if (fetch) {
      getAllSkills().then(setSkills);
    }
  }, [fetch]);

  return skills;
}
