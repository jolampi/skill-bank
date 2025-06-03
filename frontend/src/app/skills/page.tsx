"use client";

import { getApiUsersCurrent, UserSkillDto } from "@/generated/client";
import React, { useEffect, useState } from "react";

const SkillsPage: React.FC = () => {
  const [skills, setSkills] = useState<Array<UserSkillDto>>([]);

  useEffect(() => {
    getApiUsersCurrent().then((res) => {
      setSkills(res.data?.skills?.sort() ?? []);
    });
  }, []);

  return (
    <div>
      <ul>
        {skills.map((skill) => (
          <li key={skill.label}>{skill.label}</li>
        ))}
      </ul>
    </div>
  );
};

export default SkillsPage;
