"use client";

import { LinearProgress } from "@mui/material";
import Container from "@mui/material/Container";
import { SxProps, Theme } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";

import LoginForm, { LoginFormRef } from "./components/LoginForm";

import { authenticate, Credentials } from "@/services/backend/auth";

const margin: SxProps<Theme> = (theme) => ({
  [theme.breakpoints.up("sm")]: {
    marginTop: 20,
  },
});

export default function LoginPage(): React.ReactNode {
  const loginFormRef = useRef<LoginFormRef>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleLogin = async (credentials: Credentials) => {
    setSubmitting(true);
    try {
      const result = await authenticate(credentials);
      if (result) {
        router.push("/");
      }
    } finally {
      setSubmitting(false);
      loginFormRef.current?.clear();
    }
  };

  return (
    <main>
      <Container maxWidth="sm" sx={margin}>
        <LoginForm onSubmit={handleLogin} disabled={submitting} />
        {submitting && <LinearProgress />}
      </Container>
    </main>
  );
}
