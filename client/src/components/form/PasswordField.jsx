import React from "react";
import { TextField as MUITextField, InputAdornment, Button } from "@mui/material";
import FieldLabel from "./FieldLabel";

export default function PasswordField({
  id = "password",
  label = "Password",
  placeholder = "",
  value,
  onChange,
  error,
  onBlur,
  autoComplete = "new-password",
}) {
  const [show, setShow] = React.useState(false);

  return (
    <div>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <MUITextField
        id={id}
        name={id}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        error={Boolean(error)}
        helperText={error || null}
        autoComplete={autoComplete}
        fullWidth
        margin="dense"
        inputProps={{ "aria-label": label }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Button size="small" onClick={() => setShow((s) => !s)}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
}
