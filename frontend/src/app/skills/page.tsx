"use client";

import withauthentication from "@/components/withAuthentication";
import { getApiUsersCurrent, putApiUsersCurrent, UserSkillDto } from "@/generated/client";
import React, { useEffect, useState } from "react";

const SkillsPage: React.FC = () => {
  const [skills, setSkills] = useState<Array<UserSkillDto>>([]);
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    getApiUsersCurrent().then((res) => {
      setSkills(res.data?.skills?.sort((a, b) => a.label!.localeCompare(b.label!)) ?? []);
    });
  }, []);

  const handleAdd = () => {
    if (newSkill.length === 0 || skills.some((x) => x.label === newSkill)) {
      return;
    }

    setSkills((prev) => [...prev, { label: newSkill }]);
    setNewSkill("");
  };

  const handleRemove = (label: string) => {
    setSkills((prev) => prev.filter((x) => x.label !== label));
  };

  const handleSave = async () => {
    await putApiUsersCurrent({ body: { skills } });
  };

  return (
    <div>
      <ul>
        {skills.map((skill) => (
          <li key={skill.label}>
            {skill.label} <button onClick={() => handleRemove(skill.label!)}>Remove</button>
          </li>
        ))}
        <li>
          <input type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} />
          <button onClick={handleAdd}>Add</button>
        </li>
      </ul>
      <div>
        <button onClick={handleSave}>Save</button>
      </div>
    </div>
  );
};

export default withauthentication(SkillsPage);
