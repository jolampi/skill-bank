import AccountBoxIcon from "@mui/icons-material/AccountBox";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { SkillChip } from "./SkillChip";

import { Consultant } from "@/services/backend/consultants";

export interface ConsultantprofileProps {
  value: Consultant;
}

export default function ConsultantProfile(props: ConsultantprofileProps): React.ReactNode {
  const { value } = props;

  return (
    <Stack spacing={4}>
      <Stack direction="row">
        <Stack spacing={1} sx={{ flex: 2 }}>
          <Typography variant="h4">{value.name}</Typography>
          <Typography variant="subtitle1">{value.title}</Typography>
          <Typography variant="body1">{value.description}</Typography>
        </Stack>
        <Box>
          <AccountBoxIcon sx={{ margin: -5, fontSize: 250 }} />
        </Box>
      </Stack>

      <div>
        <Typography variant="h5">Skills</Typography>
        <Grid container rowSpacing={2} columnSpacing={6} sx={{ marginRight: "10%" }}>
          {value.skills.map((skill) => (
            <Grid key={skill.label} size={4}>
              <SkillChip value={skill} />
            </Grid>
          ))}
        </Grid>
      </div>
    </Stack>
  );
}
