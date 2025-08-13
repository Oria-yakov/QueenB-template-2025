import React from "react";
import { Typography } from "@mui/material";

export default function FieldLabel({ htmlFor, children }) {
  return (
    <Typography
      component="label"
      htmlFor={htmlFor}
      sx={{ display: "block", fontWeight: 600, mb: 0.25 }}
    >
      {children}
    </Typography>
  );
}
