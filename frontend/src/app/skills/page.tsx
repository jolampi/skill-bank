"use client";

import Navigation from "@/components/Navigation";
import withAuthentication from "@/components/withAuthentication";
import { getApiUsersCurrent, putApiUsersCurrent, UserSkillDto } from "@/generated/client";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useEffect, useState } from "react";
import useInput from "@/hooks/useInput";
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
  const [skills, setSkills] = useState<Array<UserSkillDto>>([]);
  const [newSkill, setNewSkill] = useInput("text");

  useEffect(() => {
    getApiUsersCurrent().then((res) => {
      setSkills(res.data?.skills?.sort((a, b) => a.label!.localeCompare(b.label!)) ?? []);
    });
  }, []);

  const handleAdd = () => {
    if (newSkill.value.length === 0 || skills.some((x) => x.label === newSkill.value)) {
      return;
    }

    setSkills((prev) => [...prev, { label: newSkill.value }]);
    setNewSkill("");
  };

  const handleRemove = (label: string) => {
    setSkills((prev) => prev.filter((x) => x.label !== label));
  };

  const handleSave = async () => {
    await putApiUsersCurrent({ body: { skills } });
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
                {skills.map((skill) => (
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
                    <TextField label="New skill" size="small" margin="none" {...newSkill} />
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
            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
          </Box>
        </Container>
      </main>
    </div>
  );
};

export default withAuthentication(SkillsPage);
