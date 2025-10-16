import { AccessTime, Delete, Edit, Save } from "@mui/icons-material";
import { Checkbox } from "@mui/material";
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, ListItem, ListItemText, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useToast } from "../../context/ToastContext.jsx";
import { deleteTask, updateTask } from "../../api/todos.js";
import { DatePicker } from "@mui/x-date-pickers";

import dayjs from "dayjs";

import CategorySelect from "./CategorySelect.jsx";
import { categories } from "../../const.js";

export default function TaskItem({ todo, setTodos }) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.title);
  const [editDeadline, setEditDeadline] = useState(dayjs(todo.deadline));
  const [editCategory, setEditCategory] = useState(todo.category);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const { addToast } = useToast();

  const handleToggle = async () => {
    try {
      const updates = { completed: !todo.completed };
      const updatedTodo = await updateTask(todo.id, updates);

      setTodos((prev) => prev.map((t) => t.id === todo.id ? updatedTodo : t));
      addToast('Task status changed successfully', 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to change task status', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(todo.id);
      setTodos((prev) => prev.filter((t) => t.id !== todo.id));
      setOpenDeleteDialog(false);
      addToast('Task deleted successfully', 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to delete task', 'error');
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setEditText(todo.title);
  };

  const handleSave = async () => {
    try {
      const updatedTodo = await updateTask(todo.id, {
        title: editText,
        deadline: editDeadline ? editDeadline.toISOString() : null,
        category: editCategory
      });

      setTodos((prev) => prev.map((t) => t.id === todo.id ? updatedTodo : t));
      setEditing(false);
      addToast('Task updated successfully', 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to update task', 'error');
    }
  };

  const textItem = editing ? (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end', flexWrap: 'wrap' }}>
      <TextField
        value={editText}
        onChange={(evt) => setEditText(evt.target.value)}
        onKeyDown={(evt) => evt.key === 'Enter' && handleSave()}
        size="small"
        sx={{ minWidth: 200, flex: 1 }}
      />
      <DatePicker
        label="Deadline"
        value={editDeadline}
        onChange={(newValue) => setEditDeadline(newValue)}
        slotProps={{
          textField: {
            size: 'small',
            sx: { minWidth: 200 }
          }
        }}
      />

      <CategorySelect value={editCategory} onChange={setEditCategory} />
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
          {dayjs(todo.deadline).format('DD MMM YYYY')}
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

  const iconButton = editing ? (
    <IconButton edge='end' onClick={handleSave}>
      <Save />
    </IconButton>) : (
    <IconButton edge='end' onClick={handleEdit}>
      <Edit />
    </IconButton>
  );

  return (
    <>
      <ListItem
        secondaryAction={
          <>
            {iconButton}
            <IconButton edge='end' onClick={() => setOpenDeleteDialog(true)}>
              <Delete />
            </IconButton>
          </>
        }
      >
        <Checkbox sx={{ cursor: 'pointer' }} edge='start' checked={todo.completed} onChange={handleToggle} />
        {textItem}
      </ListItem>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
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
}
