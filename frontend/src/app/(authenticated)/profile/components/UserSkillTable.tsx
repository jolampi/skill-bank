import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, TableHead } from "@mui/material";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";
import { useState } from "react";

import Autocomplete from "@/components/forms/Autocomplete";
import NumberInput from "@/components/forms/NumberInput";
import Rating from "@/components/forms/Rating";
import { UserSkill } from "@/services/backend";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(even)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    backgroundColor: theme.palette.common.white,
    border: 0,
  },
}));

export interface UserSkillTableProps {
  disabled?: boolean;
  skills: UserSkill[];
  skillSuggestions: string[];
  onAdd(skill: UserSkill): void;
  onChange(skill: UserSkill): void;
  onRemove(label: string): void;
}

const UserSkillTable: React.FC<UserSkillTableProps> = ({
  disabled,
  skills,
  skillSuggestions,
  onAdd,
  onChange,
  onRemove,
}) => {
  const [newLabel, setNewlabel] = useState("");
  const [newExperience, setNewExperience] = useState(0);
  const [newProficiency, setNewProficiency] = useState<number | null>(null);

  const handleAdd = () => {
    if (newLabel.length === 0 || skills.some((x) => x.label === newLabel)) {
      return;
    }
    if (newExperience < 0) {
      return;
    }
    if (!newProficiency) {
      return;
    }
    const newSkill: UserSkill = {
      label: newLabel,
      experienceInYears: newExperience,
      hidden: false,
      proficiency: newProficiency,
    };
    onAdd(newSkill);
    setNewlabel("");
    setNewExperience(0);
    setNewProficiency(null);
  };

  function handleProficiencyChange(skill: UserSkill, proficiency: number) {
    onChange({ ...skill, proficiency });
  }

  return (
    <TableContainer>
      <Table size="small" role="presentation" aria-label="My skills">
        <TableHead>
          <TableRow>
            <TableCell>
              <Box sx={{ minWidth: 200 }}>Skill</Box>
            </TableCell>
            <TableCell>Proficiency</TableCell>
            <TableCell align="right">Experience (years)</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {skills.map((skill) => (
            <StyledTableRow key={skill.label}>
              <TableCell>{skill.label}</TableCell>
              <TableCell>
                <Rating
                  disabled={disabled}
                  value={skill.proficiency}
                  onChange={(e) => handleProficiencyChange(skill, e)}
                />
              </TableCell>
              <TableCell align="right">
                <NumberInput
                  disabled={disabled}
                  maxWidth={100}
                  value={skill.experienceInYears}
                  onChange={(experienceInYears) => onChange({ ...skill, experienceInYears })}
                />
              </TableCell>
              <TableCell align="right">
                <IconButton aria-label="delete" size="small" onClick={() => onRemove(skill.label!)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </StyledTableRow>
          ))}
          <StyledTableRow>
            <TableCell>
              <Autocomplete
                disabled={disabled}
                label="Add New"
                suggestions={skillSuggestions}
                value={newLabel}
                onChange={setNewlabel}
              />
            </TableCell>
            <TableCell>
              <Rating
                defaultValue={3}
                disabled={disabled}
                value={newProficiency}
                onChange={setNewProficiency}
              />
            </TableCell>
            <TableCell align="right">
              <NumberInput
                disabled={disabled}
                maxWidth={100}
                value={newExperience}
                onChange={setNewExperience}
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
  );
};

export default UserSkillTable;
