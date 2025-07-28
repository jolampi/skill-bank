"use client";

import Alert from "@mui/material/Alert";
import Container from "@mui/material/Container";
import LinearProgress from "@mui/material/LinearProgress";
import Snackbar from "@mui/material/Snackbar";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";

import UserForm from "./components/UserForm";

import withAuthorization from "@/components/withAuthorization";
import { getCurrentUserDetails, updateCurrentUserDetails, UserDetails } from "@/services/backend";

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<UserDetails | null>(null);
  const [saving, setSaving] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    getCurrentUserDetails().then((user) => {
      user.skills.sort((a, b) => a.label.localeCompare(b.label));
      setUser(user);
    });
  }, []);

  async function handleSave(updated: UserDetails) {
    setSaving(true);
    try {
      await updateCurrentUserDetails(updated);
      setShowNotification(true);
    } finally {
      setSaving(false);
    }
  }

  const handleCloseNotification = () => {
    setShowNotification(false);
  };

  if (!user) {
    return <LinearProgress />;
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h5" sx={{ marginBottom: 3 }}>
        Edit profile
      </Typography>
      <UserForm disabled={saving} initialData={user} onSubmit={handleSave} />
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
};

export default withAuthorization(ProfilePage);
