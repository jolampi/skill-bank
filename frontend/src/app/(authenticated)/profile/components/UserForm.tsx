import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";

import SkillTable from "./SkillTable";

import TextArea from "@/components/forms/TextArea";
import TextInput from "@/components/forms/TextInput";
import { UserDetails } from "@/services/backend";
import { UserSkill } from "@/types";

export interface UserFormProps {
  disabled?: boolean;
  initialData: UserDetails;
  onSubmit(data: UserDetails): void;
}

export default function UserForm(props: UserFormProps): React.ReactNode {
  const { disabled, initialData, onSubmit } = props;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState<Array<UserSkill>>([]);

  useEffect(() => {
    setName(initialData.name);
    setDescription(initialData.description);
    setSkills(initialData.skills);
  }, [initialData]);

  function handleSubmit() {
    const user: UserDetails = {
      id: initialData.id,
      username: initialData.username,
      name,
      description,
      skills,
    };
    onSubmit(user);
  }

  return (
    <Stack component="form" spacing={4}>
      <TextInput disabled={disabled} label="Name" required value={name} onChange={setName} />
      <TextArea
        disabled={disabled}
        label="Tell something about yourself"
        value={description}
        onChange={setDescription}
      />
      <Box>
        <Typography component="p">Here you can add and modify your skills.</Typography>
        <SkillTable disabled={disabled} value={skills} onChange={setSkills} />
      </Box>
      <Box>
        <Button variant="contained" disabled={disabled} onClick={handleSubmit}>
          Save
        </Button>
      </Box>
    </Stack>
  );
}
