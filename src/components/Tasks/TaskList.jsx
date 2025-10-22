import { Box, CircularProgress, Typography } from '@mui/material';

import { useEffect } from 'react';

import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import TaskFilter from './TaskFilter.jsx';

import { useTaskStore } from '../../hooks/useStores.js';
import TaskSorting from './TaskSorting.jsx';
import { observer } from 'mobx-react-lite';

const TaskList = observer(() => {
  const { loading, filter, fetchTasks, setTasks, setFilter, filteredAndSortedTasks } = useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, []);

  if (loading) {
    return (
      <Box display='flex' justifyContent='center' mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant='h4'>My tasks</Typography>
        <TaskSorting />
      </Box>
      <TaskFilter currentFilter={filter} setFilter={setFilter} />
      <TaskForm setTodos={setTasks} />
      {!filteredAndSortedTasks.length ?
        (<Typography sx={{ mt: 2 }}>No tasks yet. Add your first task!</Typography>) :
        (filteredAndSortedTasks.map((todo) => <TaskItem key={todo.id} todo={todo} />))
      }
    </Box>
  );
});

export default TaskList;
