import TextField from "@mui/material/TextField";
import { ChangeEvent } from "react";

import { ControlledProps } from "./types";

export interface TextInputProps extends ControlledProps<string> {
  label: string;
  required?: boolean;
  type?: "text" | "password";
}

export default function TextInput(props: TextInputProps) {
  const { disabled, label, required, type, value, onChange } = props;

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange?.(event.target.value);
  }

  return (
    <TextField
      disabled={disabled}
      fullWidth
      label={label}
      required={required}
      type={type}
      value={value}
      onChange={handleChange}
    />
  );
}
