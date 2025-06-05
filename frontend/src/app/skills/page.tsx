"use client";

import Navigation from "@/components/Navigation";
import withAuthentication from "@/components/withAuthentication";
import {
  getApiSkills,
  getApiUsersCurrent,
  putApiUsersCurrent,
  UserSkillDto,
} from "@/generated/client";
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
  const [userSkills, setUserSkills] = useState<Array<UserSkillDto>>([]);
  const [newSkill, setNewSkill] = useState("");
  const [modified, setModified] = useState(false);

  useEffect(() => {
    getApiSkills().then((res) => {
      setAllSkills(res.data?.results?.map((x) => x.label ?? "") ?? []);
    });
    getApiUsersCurrent().then((res) => {
      setUserSkills(res.data?.skills?.sort((a, b) => a.label!.localeCompare(b.label!)) ?? []);
    });
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
    setModified(true)
  };

  const handleSave = async () => {
    await putApiUsersCurrent({ body: { skills: userSkills } });
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
                      handleHomeEndKeys
                      size="small"
                      options={allSkills}
                      value={newSkill}
                      onChange={(_, newValue) => {
                        if (newValue) {
                          setNewSkill(newValue);
                        }
                      }}
                      renderInput={(params) => (
                        <TextField label="Add new" {...params} />
                      )}
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
            <Button variant="contained" disabled={!modified} onClick={handleSave}>
              Save
            </Button>
          </Box>
        </Container>
      </main>
    </div>
  );
};

export default withAuthentication(SkillsPage);
