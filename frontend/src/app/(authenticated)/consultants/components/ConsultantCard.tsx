import AccountBoxIcon from "@mui/icons-material/AccountBox";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import { SxProps, Theme } from "@mui/material/styles";

import { SkillChip } from "./SkillChip";

import { Consultant } from "@/services/backend/consultants";

const cardStyle: SxProps<Theme> = {
  marginY: 2,
  display: "flex",
};

const skillsStyle: SxProps<Theme> = {
  display: "grid",
  flex: 5,
  gridAutoFlow: "column",
  gridTemplateColumns: "1fr 1fr",
  gridTemplateRows: "1fr 1fr",
  rowGap: 1,
  columnGap: 3,
};

export interface ConsultantCardProps {
  value: Consultant;
  onClick(): void;
}

export default function ConsultantCard(props: ConsultantCardProps): React.ReactNode {
  const { value, onClick } = props;

  return (
    <Card variant="outlined" sx={cardStyle}>
      <CardHeader
        avatar={<AccountBoxIcon fontSize="large" />}
        title={value.name}
        subheader={value.title}
        sx={{ flex: 3 }}
      />
      <CardContent sx={skillsStyle}>
        {value.skills.slice(0, 4).map((skill) => (
          <SkillChip key={skill.label} value={skill} />
        ))}
      </CardContent>
      <CardActions sx={{ flex: 1, justifyContent: "right" }}>
        <Button onClick={onClick}>View</Button>
      </CardActions>
    </Card>
  );
}
