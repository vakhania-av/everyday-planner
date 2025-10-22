import { action, computed, makeObservable, observable } from "mobx";
import { createTask, deleteTask, getTasks, updateTask } from "../api/todos.js";
import { sortOptions } from "../const.js";
import dayjs from "dayjs";

class TaskStore {
  @observable tasks = [];
  @observable loading = false;
  @observable error = null;
  @observable filter = 'All';
  @observable sortBy = sortOptions[0].value;

  // Элемент задания (форма редактирования задания)
  @observable editingTaskId = null;
  @observable editText = '';
  @observable editDeadline = null;
  @observable editCategory = '';
  @observable openDeleteDialog = false;
  @observable taskToDelete = null;

  // Состояния для формы создания
  @observable newTaskTitle = '';
  @observable newTaskDeadline = null;
  @observable newTaskCategory = 'other';

  constructor() {
    makeObservable(this);
  }

  @action
  setTasks = (tasks) => {
    this.tasks = tasks;
  };

  @action
  setLoading = (loading) => {
    this.loading = loading;
  };

  @action
  setError = (error) => {
    this.error = error;
  };

  @action
  setFilter = (filter) => {
    this.filter = filter;
  };

  @action
  setSortBy = (sortBy) => {
    this.sortBy = sortBy;
  };

  @action
  setEditingTaskId = (id) => {
    this.editingTaskId = id;
  };

  @action
  setEditText = (text) => {
    this.editText = text;
  };

  @action
  setEditDeadline = (deadline) => {
    this.editDeadline = deadline;
  };

  @action
  setEditCategory = (category) => {
    this.editCategory = category;
  };

  @action
  setOpenDeleteDialog = (open, taskId = null) => {
    this.openDeleteDialog = open;
    this.taskToDelete = taskId;
  };

  @action
  setNewTaskTitle = (title) => {
    this.newTaskTitle = title;
  };

  @action
  setNewTaskDeadline = (deadline) => {
    this.newTaskDeadline = deadline;
  };

  @action
  setNewTaskCategory = (category) => {
    this.newTaskCategory = category;
  };

  @action
  resetNewTaskForm = () => {
    this.newTaskTitle = '';
    this.newTaskDeadline = null;
    this.newTaskCategory = 'other';
  };

  @action
  resetEditForm = () => {
    this.editingTaskId = null;
    this.editText = '';
    this.editDeadline = null;
    this.editCategory = '';
  };

  @action
  startEditing = (task) => {
    this.setEditingTaskId(task.id);
    this.setEditText(task.title);
    this.setEditDeadline(task.deadline ? dayjs(task.deadline) : null);
    this.setEditCategory(task.category || '');
  };

  @action
  cancelEditing = () => {
    this.resetEditForm();
  };

  @action
  saveEditing = async () => {
    if (!this.editingTaskId) return;

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
      throw err;
    }
  };

  @action
  fetchTasks = async () => {
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
  createNewTask = async () => {
    if (!this.newTaskTitle.trim()) return;

    try {
      this.setError(null);

      const taskData = {
        title: this.newTaskTitle,
        deadline: this.newTaskDeadline ? this.newTaskDeadline.format('YYYY-MM-DD HH:mm:ss') : null,
        category: this.newTaskCategory
      };

      const newTask = await createTask(taskData);

      this.setTasks([{id: newTask, ...taskData}, ...this.tasks]);
      this.resetNewTaskForm();

      return newTask;
    } catch (err) {
      this.setError('Failed to create task');
      throw this.error;
    }
  };

  @action
  updateCurrentTask = async (id, updates) => {
    try {
      this.setError(null);

      const updatedTask = await updateTask(id, updates);
      const index = this.tasks.findIndex((t) => t.id === id);

      if (index !== -1) {
        this.tasks[index] = updatedTask;
      }

      return updatedTask;
    } catch (err) {
      this.setError('Failed to update task: ', err);
      throw this.error;
    }
  };

  @action
  changeCurrentTaskStatus = async (id) => {
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
  deleteCurrentTask = async (id) => {
    try {
      this.setError(null);
      await deleteTask(id);
      this.setTasks(this.tasks.filter((t) => t.id !== id));
      this.setOpenDeleteDialog(false);
    } catch (err) {
      this.setError('Failed to delete task');
      throw this.error;
    }
  };

  @computed
  get filteredAndSortedTasks() {
    let filtered = this.tasks;

    // Фильтрация
    if (this.filter === 'Active') {
      filtered = filtered.filter((task) => !task.completed);
    } else if (this.filter === 'Completed') {
      filtered = filtered.filter((task) => task.completed);
    }

    // Сортировка
    switch (this.sortBy) {
      case 'newest': return filtered.toSorted((a, b) => new Date(b.created_at) - new Date(a.created_at));
      case 'oldest': return filtered.toSorted((a, b) => new Date(a.created_at) - new Date(b.created_at));
      case 'deadline':
        return filtered.toSorted((a, b) => {
          if (!a.deadline && !b.deadline) return 0;
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;

          return new Date(a.deadline) - new Date(b.deadline);
        });
      case 'name': return filtered.toSorted((a, b) => a.title.localeCompare(b.title));
      default: return filtered;
    }
  }

  @computed
  get taskToEdit() {
    return this.tasks.find((t) => t.id === this.editingTaskId);
  }

  @computed
  get isEditing() {
    return this.editingTaskId !== null;
  }

  @computed
  get disableAddButton() {
    return !this.newTaskTitle || !this.newTaskDeadline;
  }
}

export default TaskStore;
