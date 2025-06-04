"use client";

import { useContext } from "react";
import AuthContext from "@/contexts/AuthContext";
import withAuthentication from "@/components/withAuthentication";
import Navigation from "@/components/Navigation";

const Home: React.FC = () => {
  const authContext = useContext(AuthContext);

  const handleLogout = () => {
    authContext.deauthenticate();
  };

  return (
    <div>
      <Navigation />
      <main>
        <h1>
          Welcome!
        </h1>
        <button onClick={handleLogout}>Log out</button>
      </main>
    </div>
  );
};

export default withAuthentication(Home);
