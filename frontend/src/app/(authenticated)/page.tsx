import Link from "next/link";

import { ShowConditionally } from "@/components/ShowConditionally";
import { getRole } from "@/services/backend/auth";

export default async function HomePage(): Promise<React.ReactNode> {
  const role = await getRole();

  return (
    <div>
      <h1>Welcome!</h1>
      <ShowConditionally condition={role === "Admin"}>
        <h2>Management</h2>
        <ul>
          <li>
            <Link href="/users">Manage users</Link>
          </li>
        </ul>
      </ShowConditionally>
      <ShowConditionally condition={role === "Sales"}>
        <h2>Management</h2>
        <ul>
          <li>
            <Link href="/consultants">View consultants</Link>
          </li>
        </ul>
      </ShowConditionally>
    </div>
  );
}
