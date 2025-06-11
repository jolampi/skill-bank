import AuthContext, { Role } from "@/contexts/AuthContext";
import { redirect, RedirectType } from "next/navigation";
import { ComponentType, useContext } from "react";

export default function withaAthentication(Component: ComponentType, role?: Role): React.FC {
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

  InnerComponent.displayName = `withAuthentication(${Component.displayName || Component.name})`;
  return InnerComponent;
}
