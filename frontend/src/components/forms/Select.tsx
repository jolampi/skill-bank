import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import MuiSelect, { SelectChangeEvent } from "@mui/material/Select";
import { useId } from "react";

import { ControlledProps } from "./types";

export interface SelectProps<T> extends ControlledProps<T | ""> {
  label: string;
  options: T[];
  required?: boolean;
}

export default function Select<T extends string>(props: SelectProps<T>): React.ReactNode {
  const { disabled, label, options, required, value, onChange } = props;
  const id = useId();

  function handleChange(event: SelectChangeEvent<T>) {
    onChange?.(event.target.value as T);
  }

  return (
    <FormControl required={required} fullWidth disabled={disabled}>
      <InputLabel id={id}>{label}</InputLabel>
      <MuiSelect label={label} labelId={id} value={value} onChange={handleChange}>
        {options.map((option, i) => (
          <MenuItem key={i} value={option}>
            {option}
          </MenuItem>
        ))}
      </MuiSelect>
    </FormControl>
  );
}
