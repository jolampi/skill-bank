"use client";

import withAuthorization from "@/components/withAuthorization";
import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { type SxProps, type Theme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import {
  getAllSkills,
  getCurrentUserDetails,
  updateCurrentUserDetails,
  UserSkill,
} from "@/services/backend";
import UserSkillTable from "./components/UserSkillTable";

const spaceAround: SxProps<Theme> = {
  marginY: 3,
};

const ProfilePage: React.FC = () => {
  const [allSkills, setAllSkills] = useState<Array<string>>([]);
  const [userSkills, setUserSkills] = useState<Array<UserSkill>>([]);
  const [modified, setModified] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    getCurrentUserDetails().then((details) => {
      const skills = details.skills.sort((a, b) => a.label.localeCompare(b.label));
      setUserSkills(skills);
    });
    getAllSkills().then(setAllSkills);
  }, []);

  const handleAdd = (newSkill: UserSkill) => {
    setUserSkills((prev) => [...prev, newSkill]);
    setModified(true);
  };

  const handleChange = (skill: UserSkill) => {
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
      await updateCurrentUserDetails({ skills: userSkills });
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
        <Typography component="p" sx={spaceAround}>
          Here you can add and modify your skills.
        </Typography>
        <UserSkillTable
          disabled={saving}
          skillSuggestions={allSkills}
          skills={userSkills}
          onAdd={handleAdd}
          onChange={handleChange}
          onRemove={handleRemove}
        />
        <Box sx={spaceAround}>
          <Button variant="contained" loading={saving} disabled={!modified} onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Container>

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
