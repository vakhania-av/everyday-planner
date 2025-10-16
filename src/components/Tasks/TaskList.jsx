import { Box, CircularProgress, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';

import { useState, useEffect, useMemo } from 'react';

import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import TaskFilter from './TaskFilter.jsx';

import { getTasks } from '../../api/todos.js';

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'deadline', label: 'By Deadline' },
  { value: 'name', label: 'By Name' },
];

export default function TaskList() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState(sortOptions[0].value);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const todos = await getTasks();

        setTodos(todos);
      } catch (err) {
        console.error('Error fetching todos: ', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const processedTodos = useMemo(() => {
    let result = [...todos];

    // Фильтрация
    if (filter === 'Active') result = result.filter((todo) => !todo.completed);
    if (filter === 'Completed') result = result.filter((todo) => todo.completed);

    // Сортировка
    switch (sortBy) {
      case 'newest': return result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      case 'oldest': return result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      case 'deadline':
        return result.sort((a, b) => {
          if (!a.deadline && !b.deadline) return 0;
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;

          return new Date(a.deadline) - new Date(b.deadline);
        });
      case 'name': return result.sort((a, b) => a.title.localeCompare(b.title));
      default: return result;
    }

  }, [todos, filter, sortBy]);

  if (loading) {
    return (
      <Box display='flex' justifyContent='center' mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  const tasks = !processedTodos.length ?
    (<Typography sx={{ mt: 2 }}>No tasks yet. Add your first task!</Typography>) :
    (processedTodos.map((todo) => <TaskItem key={todo.id} todo={todo} setTodos={setTodos} />));

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant='h4'>My tasks</Typography>
        <FormControl size='small' sx={{ minWidth: 180 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            label="sortBy"
            onChange={(evt) => setSortBy(evt.target.value)}
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
      </Box>

      <TaskFilter currentFilter={filter} setFilter={setFilter} />
      <TaskForm setTodos={setTodos} />
      {tasks}
    </Box>
  );
}
