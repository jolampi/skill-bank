"use client";

import { createTheme } from "@mui/material/styles";
import Link, { LinkProps } from "next/link";
import { forwardRef } from "react";

// Integrate Next.js Link with MUI Link
// https://stackoverflow.com/questions/66226576
const LinkBehaviour = forwardRef<HTMLAnchorElement, LinkProps>(function LinkBehaviour(props, ref) {
  return <Link ref={ref} {...props} />;
});

const theme = createTheme({
  cssVariables: true,
  components: {
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehaviour,
      },
    },
    MuiLink: {
      defaultProps: {
        component: LinkBehaviour,
      },
    },
  },
  typography: {
    fontFamily: "var(--font-roboto)",
  },
});

export default theme;
