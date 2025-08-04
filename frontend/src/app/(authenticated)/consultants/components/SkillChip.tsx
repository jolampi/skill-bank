import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import Rating from "@/components/forms/Rating";
import { UserSkill } from "@/types";

export interface SkillChipProps {
  value: UserSkill;
}

export function SkillChip(props: SkillChipProps): React.ReactNode {
  const { value } = props;

  return (
    <Box key={value.label} sx={{ display: "flex" }}>
      <Typography sx={{ flex: 1, fontSize: 14 }}>{value.label}</Typography>
      <Rating readonly size="small" value={value.proficiency} />
    </Box>
  );
}
