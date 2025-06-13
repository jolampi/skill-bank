import { UserSkill } from "@/services/backend";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Autocomplete from "@mui/material/Autocomplete";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

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
  onAdd(label: string): void;
  onRemove(label: string): void;
}

const UserSkillTable: React.FC<UserSkillTableProps> = ({
  disabled,
  skills,
  skillSuggestions,
  onAdd,
  onRemove,
}) => {
  const [newSkill, setNewSkill] = useState("");

  const handleAdd = () => {
    if (newSkill.length === 0 || skills.some((x) => x.label === newSkill)) {
      return;
    }
    onAdd(newSkill);
    setNewSkill("");
  };

  return (
    <TableContainer>
      <Table size="small" role="presentation" aria-label="My skills">
        <TableBody>
          {skills.map((skill) => (
            <StyledTableRow key={skill.label}>
              <TableCell>{skill.label}</TableCell>
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
  );
};

export default UserSkillTable;
