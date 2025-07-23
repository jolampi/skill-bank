"use client";

import Link from "next/link";

import RoleOnly from "@/components/RoleOnly";
import withAuthorization from "@/components/withAuthorization";

const Home: React.FC = () => {
  return (
    <div>
      <h1>Welcome!</h1>
      <RoleOnly role="Admin">
        <h2>Management</h2>
        <ul>
          <li>
            <Link href="/users">Manage users</Link>
          </li>
        </ul>
      </RoleOnly>
      <RoleOnly role="Sales">
        <h2>Management</h2>
        <ul>
          <li>
            <Link href="/consultants">View consultants</Link>
          </li>
        </ul>
      </RoleOnly>
    </div>
  );
};

export default withAuthorization(Home);
