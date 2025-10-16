import { Button, ButtonGroup } from "@mui/material";

const filters = ['All', 'Active', 'Completed'];

export default function TaskFilter({ currentFilter, setFilter }) {
  return (
    <ButtonGroup variant="contained" size="small" sx={{ mb: 3 }}>
      {filters.map((filter) => (
        <Button key={filter} color={currentFilter === filter ? 'primary' : 'inherit'} onClick={() => setFilter(filter)}>
          {filter}
        </Button>
      ))}
    </ButtonGroup>
  );
}
