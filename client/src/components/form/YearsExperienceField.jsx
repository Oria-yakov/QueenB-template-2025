import React from "react";
import { Box, Slider } from "@mui/material";
import FieldLabel from "./FieldLabel";

export default function YearsExperienceField({
  id = "years",
  value = 0,
  onChange,
  error,
  min = 0,
  max = 40,
}) {
  const handleChange = (_e, newValue) => {
    onChange(typeof newValue === "number" ? newValue : 0);
  };

  return (
    <Box sx={{ mt: 1 }}>
      <FieldLabel htmlFor={id}>Years of experience: {value}</FieldLabel>
      <Slider
        value={value}
        onChange={handleChange}
        step={1}
        min={min}
        max={max}
        sx={{
          mt: 1,
          "& .MuiSlider-rail, & .MuiSlider-track": { height: 4 }, // עובי נקי ואחיד
          "& .MuiSlider-thumb": { width: 16, height: 16 },
        }}
        valueLabelDisplay="off"
      />
      {error && (
        <div style={{ color: "#d32f2f", fontSize: 12, marginTop: 4 }}>{error}</div>
      )}
    </Box>
  );
}
