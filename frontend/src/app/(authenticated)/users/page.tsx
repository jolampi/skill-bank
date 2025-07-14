"use client";

import withAuthorization from "@/components/withAuthorization";
import { createUser, deleteUser, getAllUsers, NewUser, User } from "@/services/backend";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useCallback, useEffect, useRef, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import NewUserForm, { NewUserFormRef } from "./components/NewUserForm";

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const newUserFormRef = useRef<NewUserFormRef>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = useCallback(async () => {
    const users = await getAllUsers();
    setUsers(users);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreate = async (data: NewUser) => {
    setSubmitting(true);
    try {
      await createUser(data);
      newUserFormRef.current?.clear();
      await fetchUsers();
    } finally {
      setSubmitting(false);
    }
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

        <Box sx={{ marginTop: 12, maxWidth: 500 }}>
          <Typography variant="h5">Add new</Typography>
          <NewUserForm ref={newUserFormRef} onSubmit={handleCreate} disabled={submitting} />
        </Box>
      </Container>

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

export default withAuthorization(UsersPage, "Admin");
