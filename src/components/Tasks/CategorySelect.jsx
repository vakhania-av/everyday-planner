import { Chip, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { categories } from "../../const.js";
import { observer } from "mobx-react-lite";
import { useTaskStore } from "../../hooks/useStores.js";

const CategorySelect = observer(() => {
  const { newTaskCategory, setNewTaskCategory } = useTaskStore();

  return (
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <InputLabel>Category</InputLabel>
      <Select
        value={newTaskCategory}
        label="Category"
        onChange={(evt) => setNewTaskCategory(evt.target.value)}
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
});

export default CategorySelect;
