"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { type SxProps, type Theme } from "@mui/material/styles";
import React, { useEffect, useState } from "react";

import SkillForm from "./components/SkillForm";
import SkillTable from "./components/SkillTable";

import Modal from "@/components/Modal";
import withAuthorization from "@/components/withAuthorization";
import { getCurrentUserDetails, updateCurrentUserDetails } from "@/services/backend";
import { UserSkill } from "@/types";

const spaceAround: SxProps<Theme> = {
  marginY: 3,
};

const ProfilePage: React.FC = () => {
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [userSkills, setUserSkills] = useState<Array<UserSkill>>([]);
  const [modified, setModified] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    getCurrentUserDetails().then((details) => {
      const skills = details.skills.sort((a, b) => a.label.localeCompare(b.label));
      setDescription(details.description);
      setName(details.name);
      setUserSkills(skills);
    });
  }, []);

  const handleAdd = (newSkill: UserSkill) => {
    if (userSkills.some((x) => x.label === newSkill.label)) {
      return;
    }
    setUserSkills((prev) => [...prev, newSkill]);
    setModalOpen(false);
    setModified(true);
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
    setModified(true);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
    setModified(true);
  };

  const handleSkillChange = (skill: UserSkill) => {
    setUserSkills((prev) => prev.map((x) => (x.label === skill.label ? skill : x)));
    setModified(true);
  };

  const handleRemove = (label: string) => {
    setUserSkills((prev) => prev.filter((x) => x.label !== label));
    setModified(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateCurrentUserDetails({ description, name, skills: userSkills });
      setShowNotification(true);
      setModified(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCloseNotification = () => {
    setShowNotification(false);
  };

  return (
    <div>
      <Container maxWidth="md">
        <Box sx={spaceAround}>
          <TextField label="Name" fullWidth value={name} onChange={handleNameChange} />
        </Box>
        <Box sx={spaceAround}>
          <TextField
            label="Tell something about yourself"
            fullWidth
            multiline
            minRows={5}
            value={description}
            onChange={handleDescriptionChange}
          />
        </Box>
        <Typography component="p" sx={spaceAround}>
          Here you can add and modify your skills.
        </Typography>
        <SkillTable
          disabled={saving}
          skills={userSkills}
          onChange={handleSkillChange}
          onRemove={handleRemove}
        />
        <Button fullWidth onClick={() => setModalOpen(true)}>
          Add New
        </Button>
        <Box sx={spaceAround}>
          <Button variant="contained" loading={saving} disabled={!modified} onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Container>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <SkillForm onSubmit={handleAdd} />
      </Modal>

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
    </div>
  );
};

export default withAuthorization(ProfilePage);
