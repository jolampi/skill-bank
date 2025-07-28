import TextField from "@mui/material/TextField";
import { ChangeEvent } from "react";

import { ControlledProps } from "./types";

export interface TextAreaProps extends ControlledProps<string> {
  label: string;
}

export default function TextArea(props: TextAreaProps): React.ReactNode {
  const { disabled, label, value, onChange } = props;

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    onChange?.(event.target.value);
  }

  return (
    <TextField
      disabled={disabled}
      fullWidth
      label={label}
      minRows={5}
      multiline
      value={value}
      onChange={handleChange}
    />
  );
}
