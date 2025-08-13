import React from "react";
import { Autocomplete, TextField as MUITextField, Chip } from "@mui/material";
import FieldLabel from "./FieldLabel";

const DEFAULT_OPTIONS = [
  "JavaScript","TypeScript","Python","Java","C#","C++",
  "Go","Ruby","Swift","Kotlin","PHP","Rust"
];

export default function LanguagesMultiSelect({
  id = "languages",
  label = "Programming languages",
  value = [],
  onChange,
  options = DEFAULT_OPTIONS,
  error,
}) {
  return (
    <div>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Autocomplete
        multiple
        options={options}
        value={value}
        onChange={(_e, newValue) => onChange(newValue)}
        renderTags={(val, getTagProps) =>
          val.map((option, index) => (
            <Chip key={option} label={option} {...getTagProps({ index })} />
          ))
        }
        renderInput={(params) => (
          <MUITextField
            {...params}
            placeholder="Select languages"
            error={Boolean(error)}
            helperText={error || null}
            margin="dense"
            inputProps={{ ...params.inputProps, "aria-label": label }}
          />
        )}
        fullWidth
      />
    </div>
  );
}
