import TextField from "@mui/material/TextField";
import { ChangeEvent } from "react";

export interface NumberInputProps {
  disabled?: boolean;
  fullWidth?: boolean;
  maxWidth?: number;
  value: number;
  onChange(newValue: number): void;
}

export default function NumberInput(props: NumberInputProps): React.ReactNode {
  const { disabled, fullWidth, maxWidth, value, onChange } = props;

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const newValue = Number.parseInt(event.target.value);
    if (Number.isNaN(newValue)) {
      return;
    }
    onChange(newValue);
  }

  return (
    <TextField
      disabled={disabled}
      fullWidth={fullWidth}
      inputMode="numeric"
      value={value}
      sx={{ maxWidth }}
      type="number"
      onChange={handleChange}
    />
  );
}
