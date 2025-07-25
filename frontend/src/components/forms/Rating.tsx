import LensIcon from "@mui/icons-material/Lens";
import LensOutlinedIcon from "@mui/icons-material/LensOutlined";
import MuiRating from "@mui/material/Rating";
import { styled } from "@mui/material/styles";

const ReadOnlyRating = styled(MuiRating)(({ theme }) => ({
  "& .MuiRating-iconFilled": {
    color: theme.palette.primary.main,
  },
}));

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
  readonly?: boolean;
  size?: "small" | "medium" | "large";
  value: number | null;
  onChange?: (newValue: number) => void;
}

export default function Rating(props: RatingProps): React.ReactNode {
  const { disabled, readonly, size, value, onChange } = props;

  function handleChange(_event: React.SyntheticEvent, newValue: number | null) {
    if (newValue === null) {
      return;
    }
    onChange?.(newValue);
  }

  return readonly ? (
    <ReadOnlyRating
      emptyIcon={<LensOutlinedIcon fontSize={size} />}
      icon={<LensIcon fontSize={size} />}
      readOnly
      size={size}
      value={value}
    />
  ) : (
    <StyledRating
      disabled={disabled}
      emptyIcon={<LensOutlinedIcon fontSize={size} />}
      icon={<LensIcon fontSize={size} />}
      size={size}
      value={value}
      onChange={handleChange}
    />
  );
}
