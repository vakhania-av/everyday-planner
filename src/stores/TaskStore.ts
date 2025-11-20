import { action, computed, makeObservable, observable } from "mobx";
import { createTask, deleteTask, getTasks, updateTask } from "../api/todos";
import dayjs, { Dayjs } from "dayjs";
import { ITask, TaskFilter, TaskSortBy } from "@/types/task";
import type { RootStore } from './index';

class TaskStore {
  @observable tasks: ITask[] = [];
  @observable loading: boolean = false;
  @observable error: string | null = null;
  @observable filter: TaskFilter = 'All';
  @observable sortBy: TaskSortBy = 'newest';

  // Элемент задания (форма редактирования задания)
  @observable editingTaskId: number | null = null;
  @observable editText: string = '';
  @observable editDeadline: Dayjs | null = null;
  @observable editCategory: string = '';
  @observable openDeleteDialog: boolean = false;
  @observable taskToDelete: number | null = null;

  // Состояния для формы создания
  @observable newTaskTitle: string = '';
  @observable newTaskDeadline: Dayjs | null = null;
  @observable newTaskCategory: string = 'other';

  constructor(public rootStore: RootStore) {
    makeObservable(this);
  }

  @action
  setTasks = (tasks: ITask[]): void => {
    this.tasks = tasks;
  };

  @action
  setLoading = (loading: boolean): void => {
    this.loading = loading;
  };

  @action
  setError = (error: string | null): void => {
    this.error = error;
  };

  @action
  setFilter = (filter: TaskFilter): void => {
    this.filter = filter;
  };

  @action
  setSortBy = (sortBy: TaskSortBy): void => {
    this.sortBy = sortBy;
  };

  @action
  setEditingTaskId = (id: number | null): void => {
    this.editingTaskId = id;
  };

  @action
  setEditText = (text: string): void => {
    this.editText = text;
  };

  @action
  setEditDeadline = (deadline: Dayjs | null): void => {
    this.editDeadline = deadline;
  };

  @action
  setEditCategory = (category: string): void => {
    this.editCategory = category;
  };

  @action
  setOpenDeleteDialog = (open: boolean, taskId: number | null = null): void => {
    this.openDeleteDialog = open;
    this.taskToDelete = taskId;
  };

  @action
  setNewTaskTitle = (title: string): void => {
    this.newTaskTitle = title;
  };

  @action
  setNewTaskDeadline = (deadline: Dayjs | null): void => {
    this.newTaskDeadline = deadline;
  };

  @action
  setNewTaskCategory = (category: string): void => {
    this.newTaskCategory = category;
  };

  @action
  resetNewTaskForm = (): void => {
    this.newTaskTitle = '';
    this.newTaskDeadline = null;
    this.newTaskCategory = 'other';
  };

  @action
  resetEditForm = (): void => {
    this.editingTaskId = null;
    this.editText = '';
    this.editDeadline = null;
    this.editCategory = '';
  };

  @action
  startEditing = (task: ITask): void => {
    this.setEditingTaskId(task.id);
    this.setEditText(task.title);
    this.setEditDeadline(task.deadline ? dayjs(task.deadline) : null);
    this.setEditCategory(task.category || '');
  };

  @action
  cancelEditing = (): void => {
    this.resetEditForm();
  };

  @action
  saveEditing = async (): Promise<boolean> => {
    if (!this.editingTaskId || !this.editText.trim()) {
      return false;
    }

    try {
      const updates = {
        title: this.editText,
        category: this.editCategory,
        deadline: this.editDeadline ? this.editDeadline.format('YYYY-MM-DD HH:mm:ss') : null
      };

      await this.updateCurrentTask(this.editingTaskId, updates);
      this.resetEditForm();

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);

      this.setError(`Error saving task: ${message}`);
      console.error(this.error);
      throw this.error;
    }
  };

  @action
  fetchTasks = async (): Promise<void> => {
    try {
      this.setLoading(true);
      this.setError(null);

      const tasks = await getTasks();

      this.setTasks(tasks);
    } catch (err) {
      this.setError('Failed to fetch tasks');
      console.error('Error fetching todos: ', err);
    } finally {
      this.setLoading(false);
    }
  };

  @action
  createNewTask = async (): Promise<number | null> => {
    if (!this.newTaskTitle.trim()) {
      this.setError('Task title is required');

      return null;
    }

    try {
      this.setError(null);

      const taskData = {
        title: this.newTaskTitle.trim(),
        deadline: this.newTaskDeadline ? this.newTaskDeadline.format('YYYY-MM-DD HH:mm:ss') : null,
        category: this.newTaskCategory
      };

      const taskId = await createTask(taskData);

      this.setTasks([{
        id: taskId,
        completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...taskData
      },
      ...this.tasks]);

      this.resetNewTaskForm();
      // Обновляем цели
      this.rootStore.goalStore.updateFromTasks(this.tasks);

      return taskId;
    } catch (err) {
      this.setError('Failed to create task');
      throw this.error;
    }
  };

  @action
  updateCurrentTask = async (id: number, updates: Partial<ITask>): Promise<ITask> => {
    try {
      this.setError(null);

      const updatedTask = await updateTask(id, updates);
      const index = this.tasks.findIndex((t) => t.id === id);

      if (index !== -1) {
        this.tasks[index] = {...this.tasks[index], ...updatedTask};
      }

      //Обновляем цели при изменении статуса
      if (updates.completed) {
        this.rootStore.goalStore.updateFromTasks(this.tasks);
      }

      return updatedTask;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);

      this.setError(`Failed to update task: ${message}`);
      throw this.error;
    }
  };

  @action
  changeCurrentTaskStatus = async (id: number): Promise<void> => {
    try {
      this.setError(null);
      const task = this.tasks.find((t) => t.id === id);

      if (task) {
        const updatedTask = await updateTask(id, { completed: !task.completed });

        this.setTasks(this.tasks.map((t) => t.id === id ? updatedTask : t));
      }
    } catch (err) {
      this.setError('Failed to change the task status');
      throw this.error;
    }
  };

  @action
  deleteCurrentTask = async (id: number): Promise<void> => {
    try {
      this.setError(null);
      await deleteTask(id);
      this.setTasks(this.tasks.filter((t) => t.id !== id));
      this.setOpenDeleteDialog(false);
      // Обновляем цели
      this.rootStore.goalStore.updateFromTasks(this.tasks);
    } catch (err) {
      this.setError('Failed to delete task');
      throw this.error;
    }
  };

  @computed
  get filteredAndSortedTasks(): ITask[] {
    let filtered = this.tasks;

    // Фильтрация
    if (this.filter === 'Active') {
      filtered = filtered.filter((task) => !task.completed);
    } else if (this.filter === 'Completed') {
      filtered = filtered.filter((task) => task.completed);
    }

    // Сортировка
    switch (this.sortBy) {
      case 'newest': return filtered.toSorted((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      case 'oldest': return filtered.toSorted((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      case 'deadline':
        return filtered.toSorted((a, b) => {
          if (!a.deadline && !b.deadline) return 0;
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;

          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        });
      case 'name': return filtered.toSorted((a, b) => a.title.localeCompare(b.title));
      default: return filtered;
    }
  }

  @computed
  get taskToEdit(): ITask | undefined {
    return this.tasks.find((t) => t.id === this.editingTaskId);
  }

  @computed
  get isEditing(): boolean {
    return this.editingTaskId !== null;
  }

  @computed
  get disableAddButton(): boolean {
    return !this.newTaskTitle.trim() || !this.newTaskDeadline;
  }

  @computed
  get stats() {
    return {
      total: this.tasks.length,
      completed: this.tasks.filter((task) => task.completed).length,
      pending: this.tasks.filter((task) => !task.completed).length,
      overdue: this.tasks.filter((task) => !task.completed && task.deadline && dayjs(task.deadline).isBefore(dayjs(), 'minute')).length,
      completionRate: this.tasks.length ? Math.round((this.tasks.filter((task) => task.completed).length / this.tasks.length) * 100) : 0
    };
  }

  @computed
  get chartData() {
    const data = [];

    for (let i = 6; i >= 0; i--) {
      const date = dayjs().subtract(i, 'day');
      const dayTasks = this.tasks.filter((task) => dayjs(task.created_at).isSame(date, 'day'));
      const completedTasks = this.tasks.filter((task) => task.completed && dayjs(task.updated_at).isSame(date, 'day'));

      data.push({
        name: date.format('DD MMM'),
        created: dayTasks.length,
        completed: completedTasks.length,
        date: date.format('YYYY-MM-DD')
      });
    }

    return data;
  }
}

export default TaskStore;
