import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { FormEvent, useState } from "react";

import Autocomplete from "@/components/forms/Autocomplete";
import NumberInput from "@/components/forms/NumberInput";
import Rating from "@/components/forms/Rating";
import useSkillList from "@/hooks/useSkillList";
import { SkillFilter } from "@/services/backend/consultants";

export interface ConsultantFiltersProps {
  disabled?: boolean;
  value: SkillFilter[];
  onChange(newValue: SkillFilter[]): void;
}

export default function ConsultantFilters(props: ConsultantFiltersProps): React.ReactNode {
  const { value, onChange } = props;
  const skillSuggestions = useSkillList(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [minimumProficiency, setMinimumProficiency] = useState(1);
  const [minimumExperience, setMinimumExperience] = useState(0);

  function handleAdd(event: FormEvent<Element>) {
    event.preventDefault();
    if (searchTerm === "") {
      return;
    }
    const newFilters = value.filter((x) => x.label !== searchTerm);
    const newFilter: SkillFilter = {
      label: searchTerm,
      minimumProficiency,
      minimumExperience,
    };
    newFilters.push(newFilter);
    newFilters.sort((a, b) => a.label.localeCompare(b.label));
    onChange(newFilters);
    handleClear();
  }

  function handleClear() {
    setSearchTerm("");
    setMinimumProficiency(1);
    setMinimumExperience(0);
  }

  function handleDelete(filter: SkillFilter) {
    onChange(value.filter((x) => x.label !== filter.label));
  }

  return (
    <div>
      <Box component="form">
        <Grid container spacing={4}>
          <Grid size={12}>
            <Autocomplete
              label="Filter by skill"
              value={searchTerm}
              onChange={setSearchTerm}
              suggestions={skillSuggestions}
            />
          </Grid>
          <Grid size={6}>
            <Typography>Minimum proficiency</Typography>
            <Rating value={minimumProficiency} onChange={setMinimumProficiency} />
          </Grid>
          <Grid size={6}>
            <Typography>Minimum experience</Typography>
            <NumberInput fullWidth value={minimumExperience} onChange={setMinimumExperience} />
          </Grid>
        </Grid>
        <Box sx={{ display: "flex", gap: 1, marginY: 2 }}>
          <Button disabled={!searchTerm} variant="contained" type="submit" onClick={handleAdd}>
            Add
          </Button>
          <Button variant="outlined" onClick={handleClear}>
            Clear
          </Button>
        </Box>
      </Box>
      <Box sx={{ marginY: 2 }}>
        {value.map((filter) => (
          <Chip key={filter.label} label={getLabel(filter)} onDelete={() => handleDelete(filter)} />
        ))}
      </Box>
    </div>
  );
}

function getLabel(filter: SkillFilter): string {
  if (filter.minimumProficiency === 0) {
    return filter.label;
  }
  return filter.label + " > " + filter.minimumProficiency;
}
