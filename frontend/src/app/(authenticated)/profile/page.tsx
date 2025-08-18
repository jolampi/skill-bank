"use client";

import Alert from "@mui/material/Alert";
import Container from "@mui/material/Container";
import LinearProgress from "@mui/material/LinearProgress";
import Snackbar from "@mui/material/Snackbar";
import Typography from "@mui/material/Typography";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";

import UserEditor from "./components/UserEditor";

import {
  getCurrentUserDetails,
  updateCurrentUserDetails,
  UserDetails,
} from "@/services/backend/users";

export default function ProfilePage(): React.ReactNode {
  const queryClient = useQueryClient();
  const [showNotification, setShowNotification] = useState(false);
  const userQuery = useQuery({ queryKey: ["current-user"], queryFn: findAndPrepareUser });

  const updateUser = useMutation({
    mutationFn: updateCurrentUserDetails,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      setShowNotification(true);
    },
  });

  const handleCloseNotification = () => {
    setShowNotification(false);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h5" sx={{ marginBottom: 3 }}>
        Edit profile
      </Typography>
      {userQuery.isLoading && <LinearProgress />}
      {userQuery.isError && <p>Failed to obtain user details.</p>}
      {userQuery.isSuccess && (
        <UserEditor
          disabled={updateUser.isPending}
          initialData={userQuery.data}
          onSubmit={updateUser.mutate}
        />
      )}

      <Snackbar
        open={showNotification}
        autoHideDuration={5000}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        onClose={handleCloseNotification}
      >
        <Alert onClose={handleCloseNotification} severity="success">
          Changes saved!
        </Alert>
      </Snackbar>
    </Container>
  );
}

async function findAndPrepareUser(): Promise<UserDetails> {
  const result = await getCurrentUserDetails();
  result.skills.sort((a, b) => a.label.localeCompare(b.label));
  return result;
}
