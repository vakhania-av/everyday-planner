import { Box, Button, TextField } from "@mui/material";
import { DateTimePicker } from '@mui/x-date-pickers';
import CategorySelect from "./CategorySelect";
import { observer } from "mobx-react-lite";
import { useTaskStore, useUiStore } from "../../hooks/useStores";
import { SyntheticEvent } from "react";
import { Dayjs } from "dayjs";

const TaskForm = observer(() => {
  const { 
    newTaskTitle, 
    newTaskDeadline, 
    newTaskCategory, 
    disableAddButton, 
    setNewTaskTitle, 
    setNewTaskDeadline, 
    createNewTask, 
    setNewTaskCategory 
  } = useTaskStore();

  const { addToast } = useUiStore();

  const handleSubmit = async (evt: SyntheticEvent) => {
    evt.preventDefault();

    try {
      await createNewTask();
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
          value={newTaskTitle}
          onChange={(evt) => setNewTaskTitle(evt.target.value)}
          sx={{ minWidth: 200, flex: 1 }}
          size="small"
          slotProps={{
            htmlInput: {
              'data-tastid': 'new-task-input'
            }
          }}
        />
        <DateTimePicker
          label="Deadline"
          value={newTaskDeadline}
          onChange={(newValue: Dayjs | null) => setNewTaskDeadline(newValue)}
          slotProps={{
            textField: {
              size: 'small',
              sx: { minWidth: 200 }
            }
          }}
        />

        <CategorySelect
          value={newTaskCategory}
          onChange={setNewTaskCategory}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ height: 40 }}
          disabled={disableAddButton}
        >
          Add Task
        </Button>
      </Box>
    </Box>
  );
});

export default TaskForm;
