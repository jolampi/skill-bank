import React, { useContext } from "react";

import AuthContext, { Role } from "@/contexts/AuthContext";

export interface RoleOnlyProps {
  role: Role;
}

const RoleOnly: React.FC<React.PropsWithChildren<RoleOnlyProps>> = ({ role, children }) => {
  const authContext = useContext(AuthContext);

  if (authContext.role !== role) {
    return null;
  }

  return <div>{children}</div>;
};

export default RoleOnly;
