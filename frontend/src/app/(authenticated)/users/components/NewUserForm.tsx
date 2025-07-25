import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { SxProps, Theme } from "@mui/material/styles";
import { forwardRef, useCallback, useImperativeHandle, useState } from "react";

import { Role } from "@/contexts/AuthContext";
import useInput from "@/hooks/useInput";
import { NewUser } from "@/services/backend";

const roles: Role[] = ["Admin", "Consultant", "Sales"];

const margin: SxProps<Theme> = {
  marginY: 1,
};

export interface NewUserFormRef {
  clear(): void;
}

export interface NewUserFormProps {
  disabled?: boolean;
  onSubmit(data: NewUser): void;
}

const NewUserForm = forwardRef<NewUserFormRef, NewUserFormProps>(function NewUserForm(props, ref) {
  const { disabled, onSubmit } = props;
  const [name, setName] = useInput("text");
  const [username, setUsername] = useInput("text");
  const [password, setPassword] = useInput("password");
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
      name: name.value,
      username: username.value,
      password: password.value,
      role,
    };
    onSubmit(data);
  };

  return (
    <form>
      <TextField label="Name" required fullWidth disabled={disabled} {...name} sx={margin} />
      <TextField
        label="Username"
        required
        fullWidth
        disabled={disabled}
        {...username}
        sx={margin}
      />
      <TextField
        label="Password"
        required
        fullWidth
        disabled={disabled}
        {...password}
        sx={margin}
      />
      <FormControl required fullWidth disabled={disabled} sx={margin}>
        <InputLabel id="select-new-user-role">Role</InputLabel>
        <Select
          label="Role"
          labelId="select-new-user-role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          {roles.map((role) => (
            <MenuItem key={role} value={role}>
              {role}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        type="submit"
        variant="contained"
        disabled={disabled}
        onClick={handleSubmit}
        sx={margin}
      >
        Submit
      </Button>
    </form>
  );
});

export default NewUserForm;
