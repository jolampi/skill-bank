import MuiAutocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

export interface AutocompleteProps {
  disabled?: boolean;
  label: string;
  suggestions: string[];
  value: string;
  onChange(newValue: string): void;
}

export default function Autocomplete(props: AutocompleteProps): React.ReactNode {
  const { disabled, label, suggestions, value, onChange } = props;

  function handleChange(_event: React.SyntheticEvent, newValue: string) {
    if (newValue === null) {
      return;
    }
    onChange(newValue);
  }

  return (
    <MuiAutocomplete
      freeSolo
      fullWidth
      selectOnFocus
      disableClearable
      disabled={disabled}
      options={suggestions}
      inputValue={value}
      onInputChange={handleChange}
      renderInput={(params) => <TextField label={label} {...params} />}
    />
  );
}
