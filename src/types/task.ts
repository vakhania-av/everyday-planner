export interface ITask {
  id: number;
  title: string;
  completed: boolean;
  category: string | null;
  deadline: string | null; // ISO string или null
  created_at: string;
  updated_at: string;
}

export type TaskFilter = 'All' | 'Active' | 'Completed';

export type TaskSortBy = 'newest' | 'oldest' | 'deadline' | 'name';
