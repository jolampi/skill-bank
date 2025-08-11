import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
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
import { ControlledProps } from "@/components/forms/types";
import { UserSkill } from "@/types";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(even)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const actionsColumn: SxProps<Theme> = {
  minWidth: 70,
};

const mediumColumn: SxProps<Theme> = (theme) => ({
  display: "none",

  [theme.breakpoints.up("sm")]: {
    display: "table-cell",
  },
});

const modalStyle: SxProps<Theme> = {
  paddingTop: 4,
  paddingX: 2,
};

export type UserSkillTableProps = ControlledProps<Array<UserSkill>>;

export default function UserSkillTable(props: UserSkillTableProps) {
  const { disabled, value, onChange } = props;
  const [showAddNew, setShowAddNew] = useState(false);
  const [skillToEdit, setSkillToEdit] = useState<UserSkill | null>(null);

  function handleProficiencyChange(skill: UserSkill, proficiency: number) {
    const newSkill: UserSkill = { ...skill, proficiency };
    const newValue = value.map((x) => (x.label === skill.label ? newSkill : x));
    onChange?.(newValue);
  }

  function handleAdd(newSkill: UserSkill) {
    const newValue = value.filter((x) => x.label !== newSkill.label);
    newValue.push(newSkill);
    onChange?.(newValue);
    setShowAddNew(false);
  }

  function handleEdit(editedSkill: UserSkill) {
    const newValue = value.map((x) => (x.label === editedSkill.label ? editedSkill : x));
    onChange?.(newValue);
    setSkillToEdit(null);
  }

  function handleRemove(skill: UserSkill) {
    const skills = value.filter((x) => x.label !== skill.label);
    onChange?.(skills);
  }

  return (
    <div>
      <TableContainer>
        <Table size="small">
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
            {value.map((skill) => (
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
                  <IconButton aria-label="delete" size="small" onClick={() => handleRemove(skill)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
        <Button fullWidth onClick={() => setShowAddNew(true)}>
          Add New
        </Button>
      </TableContainer>

      <Modal open={!!skillToEdit} onClose={() => setSkillToEdit(null)}>
        <Box sx={modalStyle}>
          <SkillForm initialData={skillToEdit} onSubmit={handleEdit} />
        </Box>
      </Modal>

      <Modal open={showAddNew} onClose={() => setShowAddNew(false)}>
        <Box sx={modalStyle}>
          <SkillForm onSubmit={handleAdd} />
        </Box>
      </Modal>
    </div>
  );
}
