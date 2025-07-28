"use client";

import { SxProps, Theme } from "@mui/material";
import Box from "@mui/material/Box";

import Navigation from "@/components/Navigation";

const headerStyle: SxProps<Theme> = {
  marginBottom: 5,
};

const footerStyle: SxProps<Theme> = {
  minHeight: 150,
};

export interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export default function AuthenticatedLayout({ children }: Readonly<AuthenticatedLayoutProps>) {
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
