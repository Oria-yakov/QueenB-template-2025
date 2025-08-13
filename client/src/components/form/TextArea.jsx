import React from "react";
import { TextField as MUITextField } from "@mui/material";
import FieldLabel from "./FieldLabel";

export default function TextArea({
  id = "additionalInfo",
  label = "Additional info",
  placeholder = "",
  rows = 4,
  value,
  onChange,
  error,
  onBlur,
}) {
  return (
    <div>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <MUITextField
        id={id}
        name={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        error={Boolean(error)}
        helperText={error || null}
        fullWidth
        margin="dense"
        multiline
        minRows={rows}
        inputProps={{ "aria-label": label }}
      />
    </div>
  );
}
