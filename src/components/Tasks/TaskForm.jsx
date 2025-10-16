import { Box, Button, TextField } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers';
import { useState } from "react";
import { createTask } from "../../api/todos.js";
import CategorySelect from "./CategorySelect.jsx";
import { useToast } from "../../context/ToastContext.jsx";

export default function TaskForm({ setTodos }) {
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState(null);
  const [category, setCategory] = useState('');

  const { addToast } = useToast();

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    if (!title.trim()) return;

    try {
      const newTodoId = await createTask({
        title,
        deadline: deadline ? deadline.toISOString() : null,
        category
      });

      setTodos((prev) => [...prev, {
        id: newTodoId,
        title,
        deadline: deadline ? deadline.toISOString() : null,
        category
      }]);
      setTitle('');
      setDeadline(null);
      setCategory('');
      addToast('Task created successfully', 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to create task', 'error');
    }
  };

  return (
    <Box component='form' onSubmit={handleSubmit} sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <TextField
          label="New task"
          value={title}
          onChange={(evt) => setTitle(evt.target.value)}
          sx={{ minWidth: 200, flex: 1 }}
          size="small"
        />
        <DatePicker
          label="Deadline"
          value={deadline}
          onChange={(newValue) => setDeadline(newValue)}
          slotProps={{
            textField: {
              size: 'small',
              sx: { minWidth: 200 }
            }
          }}
        />

        <CategorySelect value={category} onChange={setCategory} />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ height: 40 }}
        >
          Add Task
        </Button>
      </Box>
    </Box>
  );
};
