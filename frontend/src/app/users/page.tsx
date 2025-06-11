"use client";

import Navigation from "@/components/Navigation";
import withAuthentication from "@/components/withAuthentication";
import { createUser, deleteUser, getAllUsers, User } from "@/services/backend";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useCallback, useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import useInput from "@/hooks/useInput";
import { Role } from "@/contexts/AuthContext";
import { SxProps, Theme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";

const roles: Role[] = ["Admin", "Consultant", "Sales"];

const addMargin: SxProps<Theme> = {
  marginBottom: 3,
};

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const [newUserUsername, setNewUserUsername] = useInput("text");
  const [newUserPassword, setNewUserPassword] = useInput("password");
  const [newUserRole, setNewuserRole] = useState<Role | "">("");

  const fetchUsers = useCallback(async () => {
    const users = await getAllUsers();
    setUsers(users);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreate: React.FormEventHandler = async (event) => {
    event.preventDefault();
    if (newUserRole === "") {
      return;
    }
    await createUser({
      username: newUserUsername.value,
      password: newUserPassword.value,
      role: newUserRole,
    });
    setNewUserUsername("");
    setNewUserPassword("");
    setNewuserRole("");
    await fetchUsers();
  };

  const handleDelete = async () => {
    if (!userToDelete) {
      return;
    }
    await deleteUser(userToDelete.id);
    setUserToDelete(null);
    await fetchUsers();
  };

  return (
    <div>
      <Box component="header" sx={{ marginBottom: 5 }}>
        <Navigation />
      </Box>

      <main>
        <Container maxWidth="md">
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        aria-label="delete"
                        size="small"
                        onClick={() => setUserToDelete(user)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box component="form" sx={{ marginTop: 12, maxWidth: 500 }}>
            <Typography variant="h5" sx={addMargin}>
              Add new
            </Typography>
            <FormControl fullWidth sx={addMargin}>
              <TextField label="Username" required {...newUserUsername} />
            </FormControl>
            <FormControl fullWidth sx={addMargin}>
              <TextField label="Password" required {...newUserPassword} />
            </FormControl>
            <FormControl required fullWidth sx={addMargin}>
              <InputLabel id="select-new-user-role">Role</InputLabel>
              <Select
                label="Role"
                labelId="select-new-user-role"
                value={newUserRole}
                onChange={(e) => setNewuserRole(e.target.value)}
              >
                {roles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <Button type="submit" variant="contained" onClick={handleCreate}>
                Add new
              </Button>
            </FormControl>
          </Box>
        </Container>
      </main>

      <Dialog open={!!userToDelete}>
        <DialogContent>
          <DialogContentText>
            Are you sure that you want to delete <strong>{userToDelete?.username}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
          <Button onClick={() => setUserToDelete(null)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default withAuthentication(UsersPage, "Admin");
