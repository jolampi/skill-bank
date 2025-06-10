"use client";

import AuthContext from "@/contexts/AuthContext";
import useInput from "@/hooks/useInput";
import theme from "@/theme";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import { SxProps, Theme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/navigation";
import React, { useContext } from "react";

const addMargin: SxProps<Theme> = {
  marginBottom: 3,
};

const LoginPage: React.FC = () => {
  const authContext = useContext(AuthContext);
  const router = useRouter();
  const [username, setUsername] = useInput("text");
  const [password, setPassword] = useInput("password");

  const handleLogin: React.FormEventHandler = async (event) => {
    event.preventDefault();
    const result = await authContext.authenticate(username.value, password.value);
    setUsername("");
    setPassword("");
    if (result) {
      router.push("/");
    }
  };

  if (authContext.loading) {
    return <div>Loading...</div>;
  }

  return (
    <main>
      <Container
        maxWidth="sm"
        sx={{
          [theme.breakpoints.up("sm")]: {
            marginTop: 20,
          },
        }}
      >
        <Box component="form" onSubmit={handleLogin}>
          <TextField required fullWidth label="Username" {...username} sx={addMargin} />
          <FormControl fullWidth sx={addMargin}>
            <TextField required label="Password" {...password} />
          </FormControl>
          <FormControl fullWidth>
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </FormControl>
        </Box>
      </Container>
    </main>
  );
};

export default LoginPage;
