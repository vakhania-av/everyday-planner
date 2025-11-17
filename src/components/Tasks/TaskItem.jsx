import { AccessTime, Cancel, Delete, Edit, Save } from "@mui/icons-material";
import { Checkbox } from "@mui/material";
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, ListItem, ListItemText, TextField, Typography } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";

import dayjs from "dayjs";

import CategorySelect from "./CategorySelect.jsx";
import { categories } from "../../const.js";
import { observer } from "mobx-react-lite";
import { useTaskStore, useUiStore } from "../../hooks/useStores.js";
import { useCallback } from "react";

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
  const isOverdue = !todo.completed && todo.deadline && dayjs(todo.deadline).isBefore(dayjs(), 'minute');

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

  const handleOpenDelete = useCallback(() => {
    setOpenDeleteDialog(true, todo.id);
  }, [setOpenDeleteDialog, todo.id]);

  const handleCloseDelete = useCallback(() => {
    setOpenDeleteDialog(false);
  }, [setOpenDeleteDialog]);

  const handleDelete = async () => {
    try {
      await deleteCurrentTask(todo.id);
      addToast('Task deleted successfully', 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to delete task', 'error');
    }
  };

  const handleKeyDown = useCallback((evt) => {
    if (evt.key === 'Enter') {
      handleSaveEdit();
    } else if (evt.key === 'Escape') {
      handleCancelEdit();
    }
  }, [handleSaveEdit, handleCancelEdit]);

  const textItem = isEditing ? (
    <Box sx={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 2,
      width: '100%',
      alignItems: 'flex-start'
    }}
    >
      <TextField
        value={editText}
        onChange={(evt) => setEditText(evt.target.value)}
        onKeyDown={handleKeyDown}
        size="small"
        sx={{ minWidth: 200, flex: 1 }}
        autoFocus
      />
      <DateTimePicker
        label="Deadline"
        value={editDeadline}
        onChange={setEditDeadline}
        slotProps={{
          textField: {
            size: 'small',
            sx: { minWidth: 200 }
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
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
          {todo.category && (
            <Chip
              label={categories.find((c) => c.id === todo.category)?.name || todo.category}
              color={categories.find((c) => c.id === todo.category)?.color || 'default'}
              size="small"
              sx={{ mr: 1, mb: 0.5 }}
            />
          )}
          <Typography
            component="span"
            sx={{
              textDecoration: todo.completed ? 'line-through' : 'none',
              opacity: todo.completed ? 0.7 : 1
            }}
          >
            {todo.title}
          </Typography>
        </Box>}
      secondary={todo.deadline && (
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
          <AccessTime fontSize="small" sx={{ mr: 0.5, opacity: 0.6 }} />
          <Typography
            variant="body2"
            component="span"
            sx={{
              color: isOverdue ? 'error.main' : 'text.secondary',
              fontWeight: isOverdue ? 'bold' : 'normal'
            }}
          >
            {dayjs(todo.deadline).format('DD MMM YYYY HH:mm')}
            {isOverdue && " • Overdue"}
          </Typography>
        </Box>
      )}
      style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
    />
  );

  const actionButtons = isEditing ? (
    <>
      <IconButton edge='end' onClick={handleSaveEdit} color="primary">
        <Save />
      </IconButton>
      <IconButton edge='end' onClick={handleCancelEdit}>
        <Cancel />
      </IconButton>
    </>) : (
    <>
      <IconButton edge='end' onClick={handleStartEdit} disabled={todo.completed}>
        <Edit />
      </IconButton>
      <IconButton edge='end' onClick={handleOpenDelete} color="error">
        <Delete />
      </IconButton>
    </>

  );

  return (
    <>
      <ListItem
        sx={{
          border: isOverdue ? '1px solid' : 'none',
          borderColor: 'error.main',
          borderRadius: 1,
          mb: 1,
          backgroundColor: isOverdue ? '#FEE9E6' : 'transparent'
        }}
        secondaryAction={
          <>
            {actionButtons}
          </>
        }
      >
        <Checkbox
          edge='start'
          sx={{ cursor: 'pointer', mt: isEditing ? 2 : 0.5 }}
          checked={todo.completed}
          onChange={handleToggle}
          disabled={isEditing}
          color="success"
        />
        <Box sx={{ flex: 1, minWidth: 0, pr: { xs: 6, sm: 8 } }}>
          {textItem}
        </Box>
      </ListItem>

      <Dialog
        open={openDeleteDialog && taskToDelete === todo.id}
        onClose={handleCloseDelete}
      >
        <DialogTitle>Delete Task</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <b>"{todo.title}"</b>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>Cancel</Button>
          <Button
            startIcon={<Delete />}
            color="error"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

export default TaskItem;
