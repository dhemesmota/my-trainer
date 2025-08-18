export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  technique: string;
  notes: string;
  alternatives: string[];
}

export interface Day {
  day: number;
  group: string;
  exercises: Exercise[];
}

export interface WorkoutWeek {
  week: number;
  days: Day[];
}

export interface ExerciseWithProgress extends Exercise {
  completed: boolean;
  currentSet: number;
}

export interface DayWithProgress extends Omit<Day, 'exercises'> {
  exercises: ExerciseWithProgress[];
  completed: boolean;
}

export interface WorkoutWeekWithProgress extends Omit<WorkoutWeek, 'days'> {
  days: DayWithProgress[];
}
