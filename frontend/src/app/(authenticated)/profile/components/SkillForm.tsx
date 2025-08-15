import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { SxProps, Theme } from "@mui/material/styles";
import { useQuery } from "@tanstack/react-query";
import { FormEvent, useEffect, useState } from "react";

import Autocomplete from "@/components/forms/Autocomplete";
import NumberInput from "@/components/forms/NumberInput";
import Rating from "@/components/forms/Rating";
import { getAllSkills } from "@/services/backend/skills";
import { UserSkill } from "@/types";

const DEFAULT_PROFICIENCY = 3;

const margin: SxProps<Theme> = {
  marginY: 2,
};

export interface SkillFormProps {
  disabled?: boolean;
  initialData?: UserSkill | null;
  onSubmit(data: UserSkill): void;
}

export default function NewSkillForm(props: SkillFormProps): React.ReactNode {
  const { disabled, initialData, onSubmit } = props;
  const [label, setLabel] = useState("");
  const [proficiency, setProficiency] = useState(DEFAULT_PROFICIENCY);
  const [experience, setExperience] = useState(0);
  const [editMode, setEditMode] = useState(true);
  const skillSuggestions = useQuery({
    queryKey: ["skills"],
    queryFn: getAllSkills,
    enabled: !editMode,
    initialData: [],
  });

  useEffect(() => {
    setEditMode(!!initialData);
    if (!initialData) {
      return;
    }
    setLabel(initialData.label);
    setProficiency(initialData.proficiency);
    setExperience(initialData.experienceInYears);
  }, [initialData]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (label.length === 0) {
      return;
    }
    if (experience < 0) {
      return;
    }
    const data: UserSkill = {
      label,
      experienceInYears: experience,
      proficiency: proficiency,
      hidden: false,
    };
    onSubmit(data);
    setLabel("");
    setProficiency(DEFAULT_PROFICIENCY);
    setExperience(0);
  }

  return (
    <form onSubmit={handleSubmit}>
      <Box>
        <Autocomplete
          disabled={disabled || editMode}
          label="Skill"
          suggestions={skillSuggestions.data}
          value={label}
          onChange={setLabel}
        />
        <Typography sx={margin}>Proficiency</Typography>
        <Rating disabled={disabled} value={proficiency} onChange={setProficiency} />
        <Typography sx={margin}>Experience (years)</Typography>
        <NumberInput
          disabled={disabled}
          maxWidth={100}
          value={experience}
          onChange={setExperience}
        />
        <Button type="submit" variant="contained" fullWidth sx={margin}>
          Submit
        </Button>
      </Box>
    </form>
  );
}
