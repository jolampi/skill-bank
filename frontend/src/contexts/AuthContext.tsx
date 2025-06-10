import React from "react";

interface StateLoading {
  loading: true;
  authenticated: null;
  role: null;
}

interface StateUnauthenticated {
  loading: false;
  authenticated: false;
  role: null;
}

interface StateAuthenticated {
  loading: false;
  authenticated: true;
  role: "Admin" | "Consultant" | "Sales";
}

export type AuthStates = StateLoading | StateUnauthenticated | StateAuthenticated;

interface AuthActions {
  authenticate(username: string, password: string): Promise<boolean>;
  deauthenticate(): Promise<void>;
}

export type AuthContextProps = AuthStates & AuthActions;

export const defaultContext: AuthContextProps = {
  loading: false,
  authenticated: false,
  role: null,
  authenticate: async () => {
    console.error("Attempting to authenticate without authentication provider.");
    return false;
  },
  deauthenticate: async () => {
    console.error("Attempting to deauthenticate without authentication provider.");
  },
};

const AuthContext = React.createContext<AuthContextProps>(defaultContext);
export default AuthContext;
