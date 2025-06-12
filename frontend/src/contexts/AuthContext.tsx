import React from "react";

export type Role = "Admin" | "Consultant" | "Sales";

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
  role: Role;
}

export type AuthStates = StateLoading | StateUnauthenticated | StateAuthenticated;

export interface Credentials {
  username: string;
  password: string;
}

interface AuthActions {
  authenticate(Credentials: Credentials): Promise<boolean>;
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
