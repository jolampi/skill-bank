"use client";

import Navigation from "@/components/Navigation";
import { SxProps, Theme } from "@mui/material";
import Box from "@mui/material/Box";

const headerMargin: SxProps<Theme> = {
  marginBottom: 5,
};

export interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export default function AuthenticatedLayout({ children }: Readonly<AuthenticatedLayoutProps>) {
  return (
    <div>
      <Box component="header" sx={headerMargin}>
        <Navigation />
      </Box>
      <main>{children}</main>
    </div>
  );
}
