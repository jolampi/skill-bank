"use client";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { FormEvent, forwardRef, useCallback, useImperativeHandle, useState } from "react";

import TextInput from "@/components/forms/TextInput";
import { Credentials } from "@/services/backend/auth";

export interface LoginFormRef {
  clear(): void;
}

export interface LoginFormProps {
  disabled?: boolean;
  onSubmit(data: Credentials): void;
}

const LoginForm = forwardRef<LoginFormRef, LoginFormProps>(function LoginForm(props, ref) {
  const { disabled, onSubmit } = props;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const clear = useCallback(() => {
    setUsername("");
    setPassword("");
  }, [setUsername, setPassword]);

  useImperativeHandle(ref, () => {
    return { clear };
  }, [clear]);

  function handleSubmit(event: FormEvent<Element>) {
    event.preventDefault();
    const data: Credentials = {
      username,
      password,
    };
    onSubmit(data);
  }

  return (
    <Stack component="form" spacing={2}>
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
      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={disabled}
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </Stack>
  );
});

export default LoginForm;
