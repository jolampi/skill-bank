import Box from "@mui/material/Box";
import MuiModal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";
import { SxProps, Theme } from "@mui/material/styles";

const containerStyle: SxProps<Theme> = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

export interface ModalProps {
  fullWidth?: boolean;
  open: boolean;
  onClose(): void;
}

export default function Modal(props: React.PropsWithChildren<ModalProps>): React.ReactNode {
  const { children, fullWidth, open, onClose } = props;

  return (
    <MuiModal open={open} onClose={onClose}>
      <Box sx={containerStyle}>
        <Paper
          sx={[
            (theme) => ({
              paddingTop: 4,
              paddingX: 2,
              width: 300,

              [theme.breakpoints.up("sm")]: {
                width: theme.breakpoints.values.sm,
              },
            }),
            fullWidth
              ? (theme) => ({
                  [theme.breakpoints.up("md")]: {
                    width: theme.breakpoints.values.md,
                  },
                })
              : {},
          ]}
        >
          {children}
        </Paper>
      </Box>
    </MuiModal>
  );
}
