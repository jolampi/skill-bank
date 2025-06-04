import AuthenticationContext from "@/contexts/AuthContext";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import { useContext } from "react";

export default function Navigation(): React.ReactNode {
  const authContext = useContext(AuthenticationContext);

  const handleLogout = () => {
    authContext.deauthenticate();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" href="/">
            Skill Bank
          </Button>
          <Button color="inherit" href="/skills">
            My Skills
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
