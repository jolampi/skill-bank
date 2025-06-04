import AuthenticationContext from "@/contexts/AuthContext";
import { redirect, RedirectType } from "next/navigation";
import { ComponentType, useContext } from "react";

export default function withauthentication(Component: ComponentType): React.FC {
  const InnerComponent: React.FC = () => {
    const authContext = useContext(AuthenticationContext);

    if (authContext.loading) {
      return <div>Loading...</div>;
    }

    if (!authContext.authenticated) {
      redirect("/login", RedirectType.replace);
    }

    return <Component />;
  };

  InnerComponent.displayName = `withAuthentication(${Component.displayName || Component.name})`;
  return InnerComponent;
}
