import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";

export default function Navigation(): React.ReactNode {
  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" href="/">
          Skill Bank
        </Button>
        <Button color="inherit" href="/skills">
          My Skills
        </Button>
      </Toolbar>
    </AppBar>
  );
}
