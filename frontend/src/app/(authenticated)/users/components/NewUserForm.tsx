import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { forwardRef, useCallback, useImperativeHandle, useState } from "react";

import Select from "@/components/forms/Select";
import TextInput from "@/components/forms/TextInput";
import { Role } from "@/services/backend/auth";
import { NewUser } from "@/services/backend/users";

const roles: Role[] = ["Admin", "Consultant", "Sales"];

export interface NewUserFormRef {
  clear(): void;
}

export interface NewUserFormProps {
  disabled?: boolean;
  onSubmit(data: NewUser): void;
}

const NewUserForm = forwardRef<NewUserFormRef, NewUserFormProps>(function NewUserForm(props, ref) {
  const { disabled, onSubmit } = props;
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role | "">("");

  const clear = useCallback(() => {
    setName("");
    setUsername("");
    setPassword("");
    setRole("");
  }, [setName, setUsername, setPassword]);

  useImperativeHandle(ref, () => {
    return { clear };
  }, [clear]);

  const handleSubmit: React.FormEventHandler = (event) => {
    event.preventDefault();
    if (role === "") {
      // Illegal state
      return;
    }
    const data: NewUser = {
      name: name,
      username: username,
      password: password,
      role,
    };
    onSubmit(data);
  };

  return (
    <Stack component="form" spacing={1}>
      <TextInput label="Name" required disabled={disabled} value={name} onChange={setName} />
      <TextInput
        disabled={disabled}
        label="Username"
        required
        value={username}
        onChange={setUsername}
      />
      <TextInput
        disabled={disabled}
        label="Password"
        required
        type="password"
        value={password}
        onChange={setPassword}
      />
      <Select
        disabled={disabled}
        label="Role"
        options={roles}
        required
        value={role}
        onChange={setRole}
      />
      <Button type="submit" variant="contained" disabled={disabled} onClick={handleSubmit}>
        Submit
      </Button>
    </Stack>
  );
});

export default NewUserForm;
