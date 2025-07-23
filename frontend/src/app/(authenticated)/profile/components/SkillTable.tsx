import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { styled, SxProps, Theme } from "@mui/material/styles";
import { useState } from "react";

import SkillForm from "./SkillForm";

import Modal from "@/components/Modal";
import Rating from "@/components/forms/Rating";
import { UserSkill } from "@/services/backend/types";
import theme from "@/theme";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(even)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const actionsColumn: SxProps<Theme> = {
  minWidth: 70,
};

const mediumColumn: SxProps<Theme> = {
  display: "none",

  [theme.breakpoints.up("sm")]: {
    display: "table-cell",
  },
};

export interface UserSkillTableProps {
  disabled?: boolean;
  skills: UserSkill[];
  onChange(skill: UserSkill): void;
  onRemove(label: string): void;
}

export default function UserSkillTable(props: UserSkillTableProps) {
  const { disabled, skills, onChange, onRemove } = props;
  const [skillToEdit, setSkillToEdit] = useState<UserSkill | null>(null);

  function handleProficiencyChange(skill: UserSkill, proficiency: number) {
    onChange({ ...skill, proficiency });
  }

  function handleSkillEdit(editedSkill: UserSkill) {
    setSkillToEdit(null);
    onChange(editedSkill);
  }

  return (
    <div>
      <TableContainer>
        <Table size="small" role="presentation" aria-label="My skills">
          <TableHead>
            <TableRow>
              <TableCell>Skill</TableCell>
              <TableCell sx={mediumColumn}>Proficiency</TableCell>
              <TableCell align="right" sx={mediumColumn}>
                Experience (years)
              </TableCell>
              <TableCell align="right" sx={actionsColumn}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {skills.map((skill) => (
              <StyledTableRow key={skill.label}>
                <TableCell>{skill.label}</TableCell>
                <TableCell sx={mediumColumn}>
                  <Rating
                    disabled={disabled}
                    value={skill.proficiency}
                    onChange={(e) => handleProficiencyChange(skill, e)}
                  />
                </TableCell>
                <TableCell align="right" sx={mediumColumn}>
                  {skill.experienceInYears || "< 1"}
                </TableCell>
                <TableCell align="right" sx={actionsColumn}>
                  <IconButton aria-label="edit" size="small" onClick={() => setSkillToEdit(skill)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    size="small"
                    onClick={() => onRemove(skill.label!)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={!!skillToEdit} onClose={() => setSkillToEdit(null)}>
        <SkillForm initialData={skillToEdit} onSubmit={handleSkillEdit} />
      </Modal>
    </div>
  );
}
