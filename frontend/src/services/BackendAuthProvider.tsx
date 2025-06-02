"use client";

import AuthContext, { AuthContextProps, AuthStates } from "@/contexts/AuthContext";
import React, { useCallback, useEffect, useState } from "react";
import { authenticate, deauthenticate, isAuthenticated } from "./backend";

const initialState: AuthStates = {
  loading: true,
  authenticated: null,
};

const BackendAuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthStates>(initialState);

  const refresh = useCallback(() => {
    const authenticated = isAuthenticated();
    setAuthState({ loading: false, authenticated });
  }, []);

  useEffect(() => refresh(), [refresh]);

  const handleAuthenticate: AuthContextProps["authenticate"] = async (username, password) => {
    const result = await authenticate({ username, password });
    refresh();
    return result;
  };

  const handleDeauthenticate = () => {
    deauthenticate();
    refresh();
  };

  const value: AuthContextProps = {
    ...authState,
    authenticate: handleAuthenticate,
    deauthenticate: handleDeauthenticate,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default BackendAuthProvider;
