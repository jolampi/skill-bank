"use client";

import { LinearProgress } from "@mui/material";
import Container from "@mui/material/Container";
import { SxProps, Theme } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import React, { useContext, useRef, useState } from "react";

import LoginForm, { LoginFormRef } from "./components/LoginForm";

import AuthContext, { Credentials } from "@/contexts/AuthContext";
import theme from "@/theme";

const margin: SxProps<Theme> = {
  [theme.breakpoints.up("sm")]: {
    marginTop: 20,
  },
};

const LoginPage: React.FC = () => {
  const authContext = useContext(AuthContext);
  const router = useRouter();
  const loginFormRef = useRef<LoginFormRef>(null);
  const [submitting, setSubmitting] = useState(false);

  const disabled = authContext.authenticated ?? submitting;

  const handleLogin = async (credentials: Credentials) => {
    setSubmitting(true);
    try {
      const result = await authContext.authenticate(credentials);
      if (result) {
        router.push("/");
      }
    } finally {
      setSubmitting(false);
      loginFormRef.current?.clear();
    }
  };

  const asd = process.env.NEXT_PUBLIC_BASE_URL;

  return (
    <main>
      <Container maxWidth="sm" sx={margin}>
        {asd}
        <LoginForm onSubmit={handleLogin} disabled={disabled} />
        {submitting && <LinearProgress />}
      </Container>
    </main>
  );
};

export default LoginPage;
