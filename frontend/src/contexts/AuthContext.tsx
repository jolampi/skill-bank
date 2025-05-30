import React from "react";

interface StateLoading {
  loading: true;
  authenticated: null;
}

interface StateReady {
  loading: false;
  authenticated: boolean;
}

export type AuthStates = StateLoading | StateReady;

interface AuthActions {
  authenticate(username: string, password: string): Promise<void>;
  deauthenticate(): void;
}

export type AuthContextProps = AuthStates & AuthActions;

export const defaultContext: AuthContextProps = {
  loading: false,
  authenticated: false,
  authenticate: async () => {
    console.error("Attempting to authenticate without authentication provider.");
  },
  deauthenticate: () => {
    console.error("Attempting to deauthenticate without authentication provider.");
  },
};

const AuthenticationContext = React.createContext<AuthContextProps>(defaultContext);
export default AuthenticationContext;
