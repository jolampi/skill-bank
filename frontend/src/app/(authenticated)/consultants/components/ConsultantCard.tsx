import AccountBoxIcon from "@mui/icons-material/AccountBox";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import { SxProps, Theme } from "@mui/material/styles";

import Rating from "@/components/forms/Rating";
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
          <Box key={skill.label} sx={{ display: "flex" }}>
            <Typography sx={{ flex: 1, fontSize: 14 }}>{skill.label}</Typography>
            <Rating readonly size="small" value={skill.proficiency} />
          </Box>
        ))}
      </CardContent>
      <CardActions sx={{ flex: 1, justifyContent: "right" }}>
        <Button onClick={onClick}>View</Button>
      </CardActions>
    </Card>
  );
}
