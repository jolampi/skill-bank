"use client";

import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";

import NewUserForm, { NewUserFormRef } from "./components/NewUserForm";

import { createUser, deleteUser, getAllUsers, User } from "@/services/backend/users";

export default function UsersPage(): React.ReactNode {
  const newUserFormRef = useRef<NewUserFormRef>(null);
  const queryClient = useQueryClient();
  const userQuery = useQuery({ queryKey: ["users"], queryFn: getAllUsers });
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      newUserFormRef.current?.clear();
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      setUserToDelete(null);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  async function handleDelete() {
    if (!userToDelete) {
      return;
    }
    await deleteMutation.mutateAsync(userToDelete.id);
  };

  const disabled = createMutation.isPending || deleteMutation.isPending;

  return (
    <div>
      <Container maxWidth="md">
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Role</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userQuery.data?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.name}</TableCell>
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
          <NewUserForm ref={newUserFormRef} onSubmit={createMutation.mutate} disabled={disabled} />
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
}
