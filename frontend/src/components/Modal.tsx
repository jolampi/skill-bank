import Box from "@mui/material/Box";
import MuiModal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";
import { SxProps, Theme } from "@mui/material/styles";

import theme from "@/theme";

const containerStyle: SxProps<Theme> = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

const paperStyle: SxProps<Theme> = {
  paddingTop: 4,
  paddingX: 2,
  width: 300,

  [theme.breakpoints.up("sm")]: {
    width: 500,
  },
};

export interface ModalProps {
  open: boolean;
  onClose(): void;
}

export default function Modal(props: React.PropsWithChildren<ModalProps>): React.ReactNode {
  const { children, open, onClose } = props;

  return (
    <MuiModal open={open} onClose={onClose}>
      <Box sx={containerStyle}>
        <Paper sx={paperStyle}>{children}</Paper>
      </Box>
    </MuiModal>
  );
}
