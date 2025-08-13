import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { FormEvent, useEffect, useState } from "react";

import SkillTable from "./SkillTable";

import TextArea from "@/components/forms/TextArea";
import TextInput from "@/components/forms/TextInput";
import { UserDetails } from "@/services/backend/users";
import { UserSkill } from "@/types";

export interface UserFormProps {
  disabled?: boolean;
  initialData: UserDetails;
  onSubmit(data: UserDetails): void;
}

export default function UserForm(props: UserFormProps): React.ReactNode {
  const { disabled, initialData, onSubmit } = props;

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState<Array<UserSkill>>([]);

  useEffect(() => {
    setName(initialData.name);
    setTitle(initialData.title);
    setDescription(initialData.description);
    setSkills(initialData.skills);
  }, [initialData]);

  function handleSave(event: FormEvent) {
    event.preventDefault();
    const user: UserDetails = {
      id: initialData.id,
      username: initialData.username,
      name,
      title,
      description,
      skills,
    };
    onSubmit(user);
  }

  return (
    <Stack spacing={4}>
      <TextInput disabled={disabled} label="Name" required value={name} onChange={setName} />
      <TextInput
        disabled={disabled}
        label="Title"
        placeholder="Fullstack Developer"
        required
        value={title}
        onChange={setTitle}
      />
      <TextArea
        disabled={disabled}
        label="Description"
        placeholder="Tell something about yourself"
        value={description}
        onChange={setDescription}
      />
      <Box>
        <Typography component="p">Here you can add and modify your skills.</Typography>
        <SkillTable disabled={disabled} value={skills} onChange={setSkills} />
      </Box>
      <Box>
        <Button disabled={disabled} variant="contained" onClick={handleSave}>
          Save
        </Button>
      </Box>
    </Stack>
  );
}
