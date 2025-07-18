"use client";

import React, { useEffect, useState } from "react";

import { authenticate, deauthenticate, getAuthentication } from "./backend";

import AuthContext, { AuthContextProps, AuthStates } from "@/contexts/AuthContext";

const initialState: AuthStates = {
  loading: true,
  authenticated: null,
  role: null,
};

const BackendAuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthStates>(initialState);

  useEffect(() => {
    async function effect() {
      const authenticated = await getAuthentication();
      setAuthState(() => {
        if (authenticated) {
          return { loading: false, authenticated: true, role: authenticated.role };
        } else {
          return { loading: false, authenticated: false, role: null };
        }
      });
    }
    effect();
  }, []);

  const handleAuthenticate: AuthContextProps["authenticate"] = async (credentials) => {
    setAuthState({ loading: true, authenticated: null, role: null });
    const result = await authenticate(credentials);
    if (result) {
      setAuthState({ loading: false, authenticated: true, role: result.role });
      return true;
    } else {
      setAuthState({ loading: false, authenticated: false, role: null });
      return false;
    }
  };

  const handleDeauthenticate = async () => {
    try {
      await deauthenticate();
    } finally {
      setAuthState({ loading: false, authenticated: false, role: null });
    }
  };

  const value: AuthContextProps = {
    ...authState,
    authenticate: handleAuthenticate,
    deauthenticate: handleDeauthenticate,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default BackendAuthProvider;
