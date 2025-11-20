export interface IGoalData {
  dailyGoal: number;
  weeklyGoal: number;
  monthlyGoal: number;
  streak: number;
  lastActivityDate: string | null;
}

export interface IGoalProgress {
  daily: IProgressIItem;
  weekly: IProgressIItem;
  monthly: IProgressIItem;
}

export interface IProgressIItem {
  completed: number;
  total: number;
  percentage: number;
}
