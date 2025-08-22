export interface User {
  id: string;
  email: string;
  name?: string;
  created_at: string;
  updated_at: string;
}

import { WorkoutWeekWithProgress } from './workout';

export interface UserWorkout {
  id: string;
  user_id: string;
  week: number;
  workout_data: WorkoutWeekWithProgress;
  created_at: string;
  updated_at: string;
}

export interface WeightRecord {
  id: string;
  user_id: string;
  exercise_name: string;
  weight: number;
  reps: number;
  sets: number;
  date: string;
  notes?: string;
  created_at: string;
}

export interface WeightProgress {
  exercise_name: string;
  current_weight: number;
  max_weight: number;
  total_workouts: number;
  last_updated: string;
  progress_percentage: number;
}
