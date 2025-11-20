import { Chip, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { categories } from "../../const";

interface ICategorySelectProps {
  value: string;
  onChange: (category: string) => void
}

export default function CategorySelect ({ value, onChange }: ICategorySelectProps) {
  return (
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <InputLabel>Category</InputLabel>
      <Select
        value={value}
        label="Category"
        onChange={(evt) => onChange(evt.target.value)}
      >
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
