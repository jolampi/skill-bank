"use client";

import { useContext } from "react";
import AuthContext from "@/contexts/AuthContext";
import Link from "next/link";
import withAuthentication from "@/components/withAuthentication";

const Home: React.FC = () => {
  const authContext = useContext(AuthContext);

  const handleLogout = () => {
    authContext.deauthenticate();
  };

  return (
    <div>
      <main>
        Welcome!
        <div>
          <Link href="/skills">
            Skills
          </Link>
        </div>
        <button onClick={handleLogout}>Log out</button>
      </main>
    </div>
  );
};

export default withAuthentication(Home);
