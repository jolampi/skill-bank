import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";
import { FormEvent, useState } from "react";

import Autocomplete from "@/components/forms/Autocomplete";
import NumberInput from "@/components/forms/NumberInput";
import Rating from "@/components/forms/Rating";
import { SkillFilter } from "@/services/backend/consultants";
import { getAllSkills } from "@/services/backend/skills";

export interface NewFilterFormProps {
  disabled?: boolean;
  onSubmit(data: SkillFilter): void;
}

export default function NewFilterForm(props: NewFilterFormProps): React.ReactNode {
  const { disabled, onSubmit } = props;
  const skillSuggestions = useQuery({
    queryKey: ["skills"],
    queryFn: getAllSkills,
    initialData: [],
  });
  const [label, setLabel] = useState("");
  const [minimumProficiency, setMinimumProficiency] = useState(1);
  const [minimumExperience, setMinimumExperience] = useState(0);

  function handleAdd(event: FormEvent<Element>) {
    event.preventDefault();
    if (label === "") {
      return;
    }
    const filter: SkillFilter = {
      label,
      minimumProficiency,
      minimumExperience,
    };
    onSubmit(filter);
    handleClear();
  }

  function handleClear() {
    setLabel("");
    setMinimumProficiency(1);
    setMinimumExperience(0);
  }

  return (
    <Box component="form">
      <Grid container spacing={4}>
        <Grid size={12}>
          <Autocomplete
            disabled={disabled}
            label="Filter by skill"
            value={label}
            onChange={setLabel}
            suggestions={skillSuggestions.data}
          />
        </Grid>
        <Grid size={6}>
          <Typography>Minimum proficiency</Typography>
          <Rating disabled={disabled} value={minimumProficiency} onChange={setMinimumProficiency} />
        </Grid>
        <Grid size={6}>
          <Typography>Minimum experience</Typography>
          <NumberInput
            disabled={disabled}
            fullWidth
            value={minimumExperience}
            onChange={setMinimumExperience}
          />
        </Grid>
      </Grid>
      <Box sx={{ display: "flex", gap: 1, marginTop: 2 }}>
        <Button disabled={!label} variant="contained" type="submit" onClick={handleAdd}>
          Add
        </Button>
        <Button variant="outlined" onClick={handleClear}>
          Clear
        </Button>
      </Box>
    </Box>
  );
}
