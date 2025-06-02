"use client";

import styles from "./page.module.css";
import { useContext } from "react";
import AuthContext from "@/contexts/AuthContext";
import Link from "next/link";

const Home: React.FC = () => {
  const authContext = useContext(AuthContext);

  const handleLogout = () => {
    authContext.deauthenticate();
  };

  if (authContext.loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {authContext.authenticated ? (
          <>
            Welcome!
            <button onClick={handleLogout}>Log out</button>
          </>
        ) : (
          <>
            <div className={styles.ctas}>
              <Link className={styles.primary} href="/login">
                Log in
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Home;
