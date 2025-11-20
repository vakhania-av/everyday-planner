import { Button, ButtonGroup } from "@mui/material";
import type { TaskFilter } from "@/types";

const filters: TaskFilter[] = ['All', 'Active', 'Completed'];

interface ITaskFilterProps {
  currentFilter: TaskFilter;
  setFilter: (filter: TaskFilter) => void
}

export default function TaskFilter({ currentFilter, setFilter }: ITaskFilterProps) {
  return (
    <ButtonGroup variant="contained" size="small" sx={{ mb: 3 }}>
      {filters.map((filter) => (
        <Button
          key={filter}
          color={currentFilter === filter ? 'primary' : 'inherit'}
          onClick={() => setFilter(filter)}
        >
          {filter}
        </Button>
      ))}
    </ButtonGroup>
  );
}
