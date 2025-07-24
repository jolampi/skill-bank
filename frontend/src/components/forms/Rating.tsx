import LensIcon from "@mui/icons-material/Lens";
import LensOutlinedIcon from "@mui/icons-material/LensOutlined";
import MuiRating from "@mui/material/Rating";
import { styled } from "@mui/material/styles";

const StyledRating = styled(MuiRating)(({ theme }) => ({
  "& .MuiRating-iconFilled": {
    color: theme.palette.grey[700],
  },
  "& .MuiRating-iconHover": {
    color: theme.palette.primary.main,
  },
}));

export interface RatingProps {
  disabled?: boolean;
  value: number | null;
  onChange(newValue: number): void;
}

export default function Rating(props: RatingProps): React.ReactNode {
  const { disabled, value, onChange } = props;

  function handleChange(_event: React.SyntheticEvent, newValue: number | null) {
    if (newValue === null) {
      return;
    }
    onChange(newValue);
  }

  return (
    <StyledRating
      disabled={disabled}
      value={value}
      onChange={handleChange}
      icon={<LensIcon />}
      emptyIcon={<LensOutlinedIcon />}
    />
  );
}
