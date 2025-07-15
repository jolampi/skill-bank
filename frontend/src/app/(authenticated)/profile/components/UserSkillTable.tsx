import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import LensIcon from "@mui/icons-material/Lens";
import LensOutlinedIcon from "@mui/icons-material/LensOutlined";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Rating from "@mui/material/Rating";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import { useState } from "react";

import { UserSkill } from "@/services/backend";

const StyledRating = styled(Rating)(({ theme }) => ({
  "& .MuiRating-iconFilled": {
    color: theme.palette.grey[700],
  },
  "& .MuiRating-iconHover": {
    color: theme.palette.primary.main,
  },
}));

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
  const [newSkillLabel, setNewSkillLabel] = useState("");
  const [newSkillProficiency, setNewSkillProficiency] = useState<number | null>(null);

  const handleAdd = () => {
    if (newSkillLabel.length === 0 || skills.some((x) => x.label === newSkillLabel)) {
      return;
    }
    if (!newSkillProficiency) {
      return;
    }
    const newSkill: UserSkill = {
      label: newSkillLabel,
      experienceInYears: 0,
      hidden: false,
      proficiency: newSkillProficiency
    };
    onAdd(newSkill);
    setNewSkillLabel("");
    setNewSkillProficiency(null);
  };

  const handleProficiencyChange = (skill: UserSkill, proficiency: number | null) => {
    if (!proficiency) {
      return;
    }
    onChange({ ...skill, proficiency });
  };

  return (
    <TableContainer>
      <Table size="small" role="presentation" aria-label="My skills">
        <TableBody>
          {skills.map((skill) => (
            <StyledTableRow key={skill.label}>
              <TableCell>{skill.label}</TableCell>
              <TableCell>
                <StyledRating
                  value={skill.proficiency}
                  onChange={(_, proficiency) => handleProficiencyChange(skill, proficiency)}
                  icon={<LensIcon />}
                  emptyIcon={<LensOutlinedIcon />}
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
                freeSolo
                selectOnFocus
                disableClearable
                disabled={disabled}
                size="small"
                options={skillSuggestions}
                inputValue={newSkillLabel}
                onInputChange={(_, newValue) => {
                  if (newValue) {
                    setNewSkillLabel(newValue);
                  }
                }}
                renderInput={(params) => <TextField label="Add new" {...params} />}
              />
            </TableCell>
            <TableCell>
              <StyledRating
                value={newSkillProficiency}
                onChange={(_, newValue) => setNewSkillProficiency(newValue)}
                defaultValue={3}
                icon={<LensIcon />}
                emptyIcon={<LensOutlinedIcon />}
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
