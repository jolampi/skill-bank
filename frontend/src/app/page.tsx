"use client";

import withAuthorization from "@/components/withAuthorization";
import Navigation from "@/components/Navigation";
import RoleOnly from "@/components/RoleOnly";
import Link from "next/link";

const Home: React.FC = () => {
  return (
    <div>
      <header>
        <Navigation />
      </header>
      <main>
        <h1>Welcome!</h1>
        <RoleOnly role="Admin">
          <h2>Management</h2>
          <ul>
            <li>
              <Link href="/users">Manage users</Link>
            </li>
          </ul>
        </RoleOnly>
      </main>
    </div>
  );
};

export default withAuthorization(Home);
