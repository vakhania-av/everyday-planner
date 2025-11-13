import { Box, CircularProgress, IconButton, Tooltip, Typography } from '@mui/material';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';
import { List, useDynamicRowHeight, useListCallbackRef } from 'react-window';

import { useCallback, useEffect, useMemo, useState } from 'react';

import TaskForm from './TaskForm';
import TaskFilter from './TaskFilter.jsx';

import { useTaskStore } from '../../hooks/useStores.js';
import TaskSorting from './TaskSorting.jsx';
import { observer } from 'mobx-react-lite';
import TaskRow from './TaskRow.jsx';
import { DEFAULT_ROW_HEIGHT } from '../../const.js';

const EnchancedTaskList = observer(() => {
  const { loading, filter, stats, filteredAndSortedTasks, fetchTasks, setTasks, setFilter } = useTaskStore();
  const [listRef, setListRef] = useListCallbackRef(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 0 });
  const dynamicRowHeight = useDynamicRowHeight({
    defaultRowHeight: 85,
    key: `tasks-${filteredAndSortedTasks.length}-${filter}`
  });

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Обработчик видимых строк
  const handleRowsRendered = useCallback(({ startIndex, stopIndex }) => {
    // Обновляем состояние только если значения действительно изменились
    setVisibleRange((prev) => {
      if (prev.start === startIndex && prev.end == stopIndex) {
        return prev; // не обновляем, если значения те же
      }

      return {
        start: startIndex,
        end: stopIndex
      };
    })
  }, []);

  // Прокрутка к верху
  const scrollToTop = useCallback(() => listRef?.scrollToRow({ index: 0, behavior: 'smooth' }), [listRef]);

  // Прокрутка к низу
  const scrollToBottom = useCallback(() => listRef?.scrollToRow({ index: Math.max(0, filteredAndSortedTasks.length - 1), behavior: 'smooth' }), [listRef, filteredAndSortedTasks.length]);

  // Обработчик клавиатуры
  useEffect(() => {
    const handleKeyDown = (evt) => {
      if (evt.ctrlKey || evt.metaKey) {
        switch (evt.key) {
          case 'Home':
            evt.preventDefault();
            scrollToTop();
            break;
          case 'End':
            evt.preventDefault();
            scrollToBottom();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [listRef, filteredAndSortedTasks.length]);

  // Мемоизируем данные для строк
  const rowData = useMemo(() => ({
    tasks: filteredAndSortedTasks,
    dynamicRowHeight
  }), [filteredAndSortedTasks, dynamicRowHeight]);

  const listHeight = useMemo(() => {
    const minHeight = 300;
    const maxHeight = 600;
    const calculatedHeight = Math.min(maxHeight, Math.max(minHeight, filteredAndSortedTasks.length * DEFAULT_ROW_HEIGHT));

    return calculatedHeight; // Минимум 200px
  }, [filteredAndSortedTasks.length]);

  if (loading) {
    return (
      <Box display='flex' justifyContent='center' mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!filteredAndSortedTasks.length) {
    return (
      <Typography sx={{ mt: 2 }}>
        No tasks yet. Add your first task!
      </Typography>
    );
  }

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Заголовок и управление */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant='h4' gutterBottom>My tasks ({filteredAndSortedTasks.length})</Typography>
          <Typography variant='body2' color='text.secondary'>
            Showing {filteredAndSortedTasks.length} of {stats.total} tasks
            {visibleRange.start !== visibleRange.end && ` (${visibleRange.start + 1}--${visibleRange.end + 1})`}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TaskSorting />

          {/* Кнопки управления скроллом */}
          {filteredAndSortedTasks.length > 8 && (
            <Box>
              <Tooltip title="Scroll to top (Ctrl+Home)">
                <IconButton onClick={scrollToTop} size='small'>
                  <KeyboardArrowUp />
                </IconButton>
              </Tooltip>
              <Tooltip title="Scroll to bottom (Ctrl+End)">
                <IconButton onClick={scrollToBottom} size='small'>
                  <KeyboardArrowDown />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>
      </Box>

      <TaskFilter currentFilter={filter} setFilter={setFilter} />
      <TaskForm setTodos={setTasks} />

      <List
        listRef={setListRef}
        rowCount={filteredAndSortedTasks.length}
        rowHeight={dynamicRowHeight} // Высота одной задачи
        rowComponent={TaskRow}
        rowProps={rowData}
        style={{
          height: listHeight, // Адаптивная высота 
          width: '100%',
          marginTop: 16
        }}
        overscanCount={3} // Рендерит дополнительные строки для плавного скролла
        onRowsRendered={handleRowsRendered}
      />

      {/* Индикатор прогресса */}
      {stats.total && (
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <Typography variant='body2' color='text.secondary'>
            Progress: {stats.completed}/{stats.total} ({stats.completionRate}%)
          </Typography>
        </Box>
      )}
    </Box >
  );

});

export default EnchancedTaskList;
