import { SxProps, Theme } from "@mui/material";
import Box from "@mui/material/Box";
import { redirect } from "next/navigation";

import Navigation from "@/components/Navigation";
import { isAuthenticated } from "@/services/backend/auth";

const headerStyle: SxProps<Theme> = {
  marginBottom: 5,
};

const footerStyle: SxProps<Theme> = {
  minHeight: 150,
};

export interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export default async function AuthenticatedLayout(
  props: React.PropsWithChildren,
): Promise<React.ReactNode> {
  const { children } = props;

  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect("/login");
  }

  return (
    <div>
      <Box component="header" sx={headerStyle}>
        <Navigation />
      </Box>
      <main>{children}</main>
      <Box component="footer" sx={footerStyle} />
    </div>
  );
}
