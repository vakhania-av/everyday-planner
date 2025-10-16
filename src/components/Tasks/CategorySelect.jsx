import { Box, Chip, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useState } from "react";
import { categories } from "../../const.js";

export default function CategorySelect({ value, onChange }) {
  const [open, setOpen] = useState(false);

  const handleChange = (evt) => { 
    onChange(evt.target.value);
  };

  const selectedCategory = categories.find((category) => category.id === value);

  return (
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <InputLabel>Category</InputLabel>
      <Select
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        value={value || ''}
        onChange={handleChange}
        label="Category"
        renderValue={() => (
          selectedCategory ? (
            <Chip
              label={selectedCategory.name}
              color={selectedCategory.color}
              size="small" />
          ) : (
            <Box sx={{ color: 'text.secondary' }}>Select category</Box>
          )
        )}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {categories.map(({ id, name, color }) => (
          <MenuItem key={id} value={id}>
            <Chip
              label={name}
              color={color}
              size="small"
              sx={{ mr: 1 }} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
