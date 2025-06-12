import { Credentials } from "@/contexts/AuthContext";
import { forwardRef, useCallback, useImperativeHandle } from "react";
import { SxProps, Theme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import useInput from "@/hooks/useInput";

const margin: SxProps<Theme> = {
  marginY: 1,
};

export interface LoginFormRef {
  clear(): void;
}

export interface LoginFormProps {
  disabled?: boolean;
  onSubmit(data: Credentials): void;
}

const LoginForm = forwardRef<LoginFormRef, LoginFormProps>(function LoginForm(props, ref) {
  const { disabled, onSubmit } = props;
  const [username, setUsername] = useInput("text");
  const [password, setPassword] = useInput("password");

  const clear = useCallback(() => {
    setUsername("");
    setPassword("");
  }, [setUsername, setPassword]);

  useImperativeHandle(ref, () => {
    return { clear };
  }, [clear]);

  const handleSubmit: React.FormEventHandler = (event) => {
    event.preventDefault();
    const data: Credentials = {
      username: username.value,
      password: password.value,
    };
    onSubmit(data);
  };

  return (
    <form>
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
      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={disabled}
        onClick={handleSubmit}
        sx={margin}
      >
        Submit
      </Button>
    </form>
  );
});

export default LoginForm;
