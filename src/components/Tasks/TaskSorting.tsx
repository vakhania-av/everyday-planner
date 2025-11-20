import { observer } from "mobx-react-lite";
import { sortOptions } from "../../const";
import { useTaskStore } from "../../hooks/useStores";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const TaskSorting = observer(() => {
  const { loading, sortBy, setSortBy } = useTaskStore();
  
  return (
    <FormControl size='small' sx={{ minWidth: 180 }}>
      <InputLabel>Sort By</InputLabel>
      <Select
        value={sortBy}
        label="sortBy"
        onChange={(evt) => setSortBy(evt.target.value)}
        disabled={loading}
      >
        {sortOptions.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
          >
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
});

export default TaskSorting;
