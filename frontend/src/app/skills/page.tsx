"use client";

import Navigation from "@/components/Navigation";
import withAuthentication from "@/components/withAuthentication";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import Typography from "@mui/material/Typography";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { styled, type SxProps, type Theme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import {
  getAllSkills,
  getCurrentUserDetails,
  updateCurrentUserDetails,
  UserSkill,
} from "@/services/backend";

const spaceAround: SxProps<Theme> = {
  marginY: 3,
};

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(even)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    backgroundColor: theme.palette.common.white,
    border: 0,
  },
}));

const SkillsPage: React.FC = () => {
  const [allSkills, setAllSkills] = useState<Array<string>>([]);
  const [userSkills, setUserSkills] = useState<Array<UserSkill>>([]);
  const [newSkill, setNewSkill] = useState("");
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

  const handleAdd = () => {
    if (newSkill.length === 0 || userSkills.some((x) => x.label === newSkill)) {
      return;
    }
    setUserSkills((prev) => [...prev, { label: newSkill }]);
    setModified(true);
    setNewSkill("");
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
      <header>
        <Navigation />
      </header>
      <main>
        <Container maxWidth="md">
          <Typography component="p" sx={spaceAround}>
            Here you can add and modify your skills.
          </Typography>
          <TableContainer>
            <Table size="small" role="presentation" aria-label="My skills">
              <TableBody>
                {userSkills.map((skill) => (
                  <StyledTableRow key={skill.label}>
                    <TableCell>{skill.label}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        aria-label="delete"
                        size="small"
                        onClick={() => handleRemove(skill.label!)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </StyledTableRow>
                ))}
                <StyledTableRow>
                  <TableCell>
                    <Autocomplete
                      freeSolo
                      selectOnFocus
                      disableClearable
                      disabled={saving}
                      size="small"
                      options={allSkills}
                      inputValue={newSkill}
                      onInputChange={(_, newValue) => {
                        if (newValue) {
                          setNewSkill(newValue);
                        }
                      }}
                      renderInput={(params) => <TextField label="Add new" {...params} />}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Button disableElevation startIcon={<AddIcon />} onClick={handleAdd}>
                      Add
                    </Button>
                  </TableCell>
                </StyledTableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={spaceAround}>
            <Button variant="contained" loading={saving} disabled={!modified} onClick={handleSave}>
              Save
            </Button>
          </Box>
        </Container>
      </main>
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

export default withAuthentication(SkillsPage);
