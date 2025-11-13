import { AccessTime, Cancel, Delete, Edit, Save } from "@mui/icons-material";
import { Checkbox } from "@mui/material";
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, ListItem, ListItemText, TextField, Typography } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";

import dayjs from "dayjs";

import CategorySelect from "./CategorySelect.jsx";
import { categories } from "../../const.js";
import { observer } from "mobx-react-lite";
import { useTaskStore, useUiStore } from "../../hooks/useStores.js";

const TaskItem = observer(({ todo }) => {
  const {
    editingTaskId,
    editText,
    editDeadline,
    editCategory,
    openDeleteDialog,
    taskToDelete,
    setEditDeadline,
    setEditCategory,
    changeCurrentTaskStatus,
    deleteCurrentTask,
    setOpenDeleteDialog,
    setEditText,
    startEditing,
    cancelEditing,
    saveEditing
  } = useTaskStore();

  const { addToast } = useUiStore();

  const isEditing = editingTaskId === todo.id;

  const handleToggle = async () => {
    try {
      await changeCurrentTaskStatus(todo.id);
      addToast('Task status changed successfully', 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to change task status', 'error');
    }
  };

  const handleStartEdit = () => startEditing(todo);

  const handleSaveEdit = async () => {
    try {
      saveEditing();
      addToast('Task updated successfully', 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to update task', 'error');
    }
  };

  const handleCancelEdit = () => cancelEditing();

  const handleOpenDelete = () => setOpenDeleteDialog(true, todo.id);

  const handleDelete = async () => {
    try {
      await deleteCurrentTask(todo.id);
      addToast('Task deleted successfully', 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to delete task', 'error');
    }
  };

  const textItem = isEditing ? (
    <Box sx={{
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 1.5,
      width: '100%',
      minWidth: 0,
      '& > *': {
        minWidth: 140,
        flex: '1 1 140px'
      }
    }}
    >
      <TextField
        value={editText}
        onChange={(evt) => setEditText(evt.target.value)}
        onKeyDown={(evt) => evt.key === 'Enter' && handleSaveEdit()}
        size="small"
        sx={{ minWidth: 140 }}
      />
      <DateTimePicker
        label="Deadline"
        value={editDeadline}
        onChange={(newValue) => setEditDeadline(newValue)}
        slotProps={{
          textField: {
            size: 'small',
            sx: { minWidth: { xs: 100, sm: 200 }, flex: 1 }
          }
        }}
      />
      <CategorySelect
        value={editCategory}
        onChange={setEditCategory}
      />
    </Box>
  ) : (
    <ListItemText
      primary={
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {todo.category && (
            <Chip
              label={categories.find((c) => c.id === todo.category)?.name || todo.category}
              color={categories.find((c) => c.id === todo.category)?.color || 'default'}
              size="small"
              sx={{ mr: 1 }}
            />
          )}
          {todo.title}
        </Box>}
      secondary={todo.deadline && (
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
          <AccessTime fontSize="small" sx={{ mr: 0.5 }} />
          {dayjs(todo.deadline).format('DD MMM YYYY HH:mm')}
          {dayjs(todo.deadline).isBefore(dayjs()) && !todo.completed && (
            <Typography
              component="span"
              sx={{ ml: 1, color: 'error.main', fontSize: '0.75rem' }}
            >
              Overdue
            </Typography>
          )}
        </Box>
      )}
      style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
    />
  );

  const iconButton = isEditing ? (
    <>
      <IconButton edge='end' onClick={handleSaveEdit}>
        <Save />
      </IconButton>
      <IconButton edge='end' onClick={handleCancelEdit}>
        <Cancel />
      </IconButton>
    </>) : (
    <>
      <IconButton edge='end' onClick={handleStartEdit}>
        <Edit />
      </IconButton>
      <IconButton edge='end' onClick={handleOpenDelete}>
        <Delete />
      </IconButton>
    </>

  );

  return (
    <>
      <ListItem
        sx={{
          minHeight: isEditing ? { xs: 140, sm: 'auto' } : 'auto',
          position: 'relative',
          overflow: 'visible',
          border: '2px solid red',
          mb: isEditing ? 1.5 : 0
        }}
        secondaryAction={
          <>
            {iconButton}
          </>
        }
      >
        <Checkbox
          edge='start'
          sx={{ cursor: 'pointer', mt: isEditing ? 2 : 0.5 }}
          checked={todo.completed}
          onChange={handleToggle}
          disabled={isEditing}
        />
        <Box sx={{ flex: 1, minWidth: 0, pr: { xs: 6, sm: 8 } }}>
          {textItem}
        </Box>
      </ListItem>

      <Dialog open={openDeleteDialog && taskToDelete === todo.id} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Delete Task</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{todo.title}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

export default TaskItem;
