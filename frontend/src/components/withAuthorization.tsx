import { redirect, RedirectType } from "next/navigation";
import { ComponentType, useContext } from "react";

import AuthContext, { Role } from "@/contexts/AuthContext";

export default function withAuthorization(Component: ComponentType, role?: Role): React.FC {
  const InnerComponent: React.FC = () => {
    const authContext = useContext(AuthContext);

    if (authContext.loading) {
      return <div>Loading...</div>;
    }

    if (!authContext.authenticated) {
      redirect("/login", RedirectType.replace);
    }

    if (role && authContext.role !== role) {
      redirect("/", RedirectType.replace);
    }

    return <Component />;
  };

  const displayName = Component.displayName || Component.name || "Component";
  InnerComponent.displayName = `withAuthorization(${displayName})`;
  return InnerComponent;
}
