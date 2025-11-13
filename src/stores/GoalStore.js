import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

import { action, makeObservable, observable } from "mobx";
import { DATE_FORMAT } from "../const";

dayjs.extend(isSameOrAfter);

class GoalStore {
  @observable dailyGoal = 5; // Цель по задачам
  @observable weeklyGoal = 25;
  @observable monthlyGoal = 100;
  @observable streak = 0;
  @observable lastActivityDate = null;

  constructor() {
    makeObservable(this);
    this.loadGoalsFromStorage();
  }

  @action
  setDailyGoal = (goal) => {
    this.dailyGoal = goal;
    this.saveGoalsToStorage();
  };

  @action
  setWeeklyGoal = (goal) => {
    this.weeklyGoal = goal;
    this.saveGoalsToStorage();
  };

  @action
  setMonthlyGoal = (goal) => {
    this.monthlyGoal = goal;
    this.saveGoalsToStorage();
  };

  @action
  updateFromTasks = (tasks) => {
    const today = dayjs().startOf('day');
    const todayString = today.format(DATE_FORMAT);
    const todayCompleted = tasks.filter((task) => task.completed && dayjs(task.updated_at).isSame(today, 'day')).length;
    
    // Обновляем серию
    if (todayCompleted > 0 && this.lastActivityDate !== todayString) {
      const yesterday = dayjs().subtract(1, 'day').startOf('day');
      const wasActiveYesterday = this.lastActivityDate && dayjs(this.lastActivityDate).isSame(yesterday, 'day');

      this.streak = wasActiveYesterday ? this.streak + 1 : 1;
      this.lastActivityDate = todayString;
      this.saveGoalsToStorage();
    }
  };

  loadGoalsFromStorage = () => {
    try {
      const saved = localStorage.getItem('app-goals');

      if (saved) {
        const goals = JSON.parse(saved);

        this.dailyGoal = goals.dailyGoal || 5;
        this.weeklyGoal = goals.weeklyGoal || 25;
        this.monthlyGoal = goals.monthlyGoal || 100;
        this.streak = goals.streak || 0;
        this.lastActivityDate = goals.lastActivityDate || null;
      }
    } catch (err) {
      console.warn('Failed to parse goals from localStorage', err);
    }
  };

  saveGoalsToStorage = () => {
    const goals = {
      dailyGoal: this.dailyGoal,
      weeklyGoal: this.weeklyGoal,
      monthlyGoal: this.monthlyGoal,
      streak: this.streak,
      lastActivityDate: this.lastActivityDate
    };

    localStorage.setItem('app-goals', JSON.stringify(goals));
  };

  getProgress = (tasks) => {
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
        percentage: Math.min((todayCompleted / this.dailyGoal) * 100, 100)
      },
      weekly: {
        completed: weekCompleted,
        total: this.weeklyGoal,
        percentage: Math.min((weekCompleted / this.weeklyGoal) * 100, 100)
      },
      monthly: {
        completed: monthCompleted,
        total: this.monthlyGoal,
        percentage: Math.min((monthCompleted / this.monthlyGoal) * 100, 100)
      }
    };
  };
}

export default GoalStore;
