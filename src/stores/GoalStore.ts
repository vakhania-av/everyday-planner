import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

import { action, makeObservable, observable } from "mobx";
import { ITask } from "@/types";
import { IGoalData, IGoalProgress } from "@/types/goal";
import { DefaultSettings } from "@/const";

dayjs.extend(isSameOrAfter);

class GoalStore {
  @observable dailyGoal: number = 5; // Цель по задачам
  @observable weeklyGoal: number = 25;
  @observable monthlyGoal: number = 100;
  @observable streak: number = 0;
  @observable lastActivityDate: string | null = null;

  constructor() {
    makeObservable(this);
    this.loadGoalsFromStorage();
  }

  @action
  setDailyGoal = (goal: number): void => {
    this.dailyGoal = goal;
    this.saveGoalsToStorage();
  };

  @action
  setWeeklyGoal = (goal: number): void => {
    this.weeklyGoal = goal;
    this.saveGoalsToStorage();
  };

  @action
  setMonthlyGoal = (goal: number): void => {
    this.monthlyGoal = goal;
    this.saveGoalsToStorage();
  };

  @action
  updateFromTasks = (tasks: ITask[]): void => {
    const today = dayjs().startOf('day');
    const todayString = today.format(DefaultSettings.DateFormat);
    const todayCompleted = tasks.filter((task) => task.completed && dayjs(task.updated_at).isSame(today, 'day')).length;
    
    // Обновляем серию только если есть новые незавершённые задачи сегодня
    if (todayCompleted > 0 && this.lastActivityDate !== todayString) {
      const yesterday = dayjs().subtract(1, 'day').startOf('day');
      const wasActiveYesterday = this.lastActivityDate && dayjs(this.lastActivityDate).isSame(yesterday, 'day');

      this.streak = wasActiveYesterday ? this.streak + 1 : 1;
      this.lastActivityDate = todayString;
      this.saveGoalsToStorage();
    }
  };

  loadGoalsFromStorage = (): void => {
    try {
      const saved = localStorage.getItem('app-goals');

      if (saved) {
        const goals = JSON.parse(saved) as Partial<IGoalData>;

        this.dailyGoal = typeof goals.dailyGoal === 'number' ? goals.dailyGoal : 5;
        this.weeklyGoal = typeof goals.weeklyGoal === 'number' ? goals.weeklyGoal : 25;
        this.monthlyGoal = typeof goals.monthlyGoal === 'number' ? goals.monthlyGoal : 100;
        this.streak = typeof goals.streak === 'number' ? goals.streak : 0;
        this.lastActivityDate = typeof goals.lastActivityDate === 'string' ? goals.lastActivityDate : null;
      }
    } catch (err) {
      console.warn('Failed to parse goals from localStorage', err);
    }
  };

  saveGoalsToStorage = (): void => {
    const goals: IGoalData = {
      dailyGoal: this.dailyGoal,
      weeklyGoal: this.weeklyGoal,
      monthlyGoal: this.monthlyGoal,
      streak: this.streak,
      lastActivityDate: this.lastActivityDate
    };

    localStorage.setItem('app-goals', JSON.stringify(goals));
  };

  getProgress = (tasks: ITask[]): IGoalProgress => {
    const today = dayjs().startOf('day');
    const weekStart = dayjs().startOf('week');
    const monthStart = dayjs().startOf('month');

    let todayCompleted = 0,
      weekCompleted = 0,
      monthCompleted = 0;

    for (const task of tasks) {
      if (!task.completed) {
        continue;
      }

      const updatedAt = dayjs(task.updated_at);

      if (updatedAt.isSame(today, 'day')) {
        todayCompleted++;
      }

      if (updatedAt.isSameOrAfter(weekStart, 'day')) {
        weekCompleted++;
      }

      if (updatedAt.isSameOrAfter(monthStart, 'day')) {
        monthCompleted++;
      }
    }

    return {
      daily: {
        completed: todayCompleted,
        total: this.dailyGoal,
        percentage: this.dailyGoal > 0 ? Math.min((todayCompleted / this.dailyGoal) * 100, 100) : 0
      },
      weekly: {
        completed: weekCompleted,
        total: this.weeklyGoal,
        percentage: this.weeklyGoal > 0 ? Math.min((weekCompleted / this.weeklyGoal) * 100, 100) : 0
      },
      monthly: {
        completed: monthCompleted,
        total: this.monthlyGoal,
        percentage: this.monthlyGoal > 0 ? Math.min((monthCompleted / this.monthlyGoal) * 100, 100) : 0
      }
    };
  };
}

export default GoalStore;
