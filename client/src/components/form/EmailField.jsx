import React from "react";
import { TextField as MUITextField } from "@mui/material";
import FieldLabel from "./FieldLabel";

export default function EmailField({
  id = "email",
  label = "Email",
  placeholder = "",
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
        type="email"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        error={Boolean(error)}
        helperText={error || null}
        autoComplete="email"
        fullWidth
        margin="dense"
        inputProps={{ "aria-label": label }}
      />
    </div>
  );
}
