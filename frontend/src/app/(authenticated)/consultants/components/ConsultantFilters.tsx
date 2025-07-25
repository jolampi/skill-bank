import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";

import { SkillFilter } from "@/services/backend/consultants";

export interface ConsultantFiltersProps {
  disabled?: boolean;
  value: SkillFilter[];
  onChange(newValue: SkillFilter[]): void;
}

export default function ConsultantFilters(props: ConsultantFiltersProps): React.ReactNode {
  const { value, onChange } = props;

  function handleDelete(filter: SkillFilter) {
    onChange(value.filter((x) => x.label !== filter.label));
  }

  return (
    <div>
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
