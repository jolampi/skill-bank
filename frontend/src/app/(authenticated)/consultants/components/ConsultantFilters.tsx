import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import { useState } from "react";

import Autocomplete from "@/components/forms/Autocomplete";
import useSkillList from "@/hooks/useSkillList";
import { SkillFilter } from "@/services/backend/consultants";

export interface ConsultantFiltersProps {
  disabled?: boolean;
  value: SkillFilter[];
  onChange(newValue: SkillFilter[]): void;
}

function getLabel(filter: SkillFilter): string {
  if (filter.proficiency === 0) {
    return filter.label;
  }
  return filter.label + " > " + filter.proficiency;
}

export default function ConsultantFilters(props: ConsultantFiltersProps): React.ReactNode {
  const { value, onChange } = props;
  const skillSuggestions = useSkillList(true);
  const [searchTerm, setSearchTerm] = useState("");

  function handleAdd() {
    if (searchTerm === "") {
      return;
    }
    const newFilter: SkillFilter = {
      label: searchTerm,
      experienceInYears: 0,
      proficiency: 0,
    };
    onChange([...value, newFilter]);
    setSearchTerm("");
  }

  function handleDelete(filter: SkillFilter) {
    onChange(value.filter((x) => x.label !== filter.label));
  }

  return (
    <div>
      <div>
        <Typography component="h1">Search for consultants</Typography>
        <Autocomplete
          label="Filter by skill"
          value={searchTerm}
          onChange={setSearchTerm}
          suggestions={skillSuggestions}
        />
        <Button onClick={handleAdd}>Add</Button>
      </div>
      {value.map((filter) => (
        <Chip key={filter.label} label={getLabel(filter)} onDelete={() => handleDelete(filter)} />
      ))}
    </div>
  );
}
