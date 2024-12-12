"use client";

import React, { createContext, useContext, useReducer, useEffect } from 'react';

interface RunningEntry {
  date: string;
  distance: string;
  time: string;
  notes?: string;
}

interface ExerciseDetail {
  exercise: string;
  reps: string | "duration";
  duration?: string;
  weight: string | "N/A";
}

interface StrengthWorkout {
  id: string; // Added to help with updates/deletes
  date: string;
  duration?: string;
  exercises: ExerciseDetail[];
}

interface WorkoutData {
  running: RunningEntry[];
  strengthWorkouts: StrengthWorkout[];
}

type WorkoutAction = 
  | { type: 'ADD_RUNNING'; payload: RunningEntry }
  | { type: 'ADD_STRENGTH_WORKOUT'; payload: StrengthWorkout }
  | { type: 'UPDATE_STRENGTH_WORKOUT'; payload: { id: string; workout: StrengthWorkout } }
  | { type: 'DELETE_STRENGTH_WORKOUT'; payload: string }
  | { type: 'ADD_EXERCISE_TO_WORKOUT'; payload: { workoutId: string; exercise: ExerciseDetail } }
  | { type: 'DELETE_EXERCISE_FROM_WORKOUT'; payload: { workoutId: string; exerciseIndex: number } }
  | { type: 'DELETE_RUNNING'; payload: number }
  | { type: 'IMPORT_DATA'; payload: WorkoutData }
  | { type: 'RESET_DATA' };

interface WorkoutContextType {
  workoutData: WorkoutData;
  dispatch: React.Dispatch<WorkoutAction>;
  exportData: () => void;
  importData: (jsonData: string) => void;
  resetData: () => void;
}

const initialState: WorkoutData = {
  running: [],
  strengthWorkouts: []
};

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function workoutReducer(state: WorkoutData, action: WorkoutAction): WorkoutData {
  switch (action.type) {
    case 'ADD_RUNNING':
      return {
        ...state,
        running: [...state.running, action.payload]
      };
    
    case 'ADD_STRENGTH_WORKOUT':
      return {
        ...state,
        strengthWorkouts: [...state.strengthWorkouts, {
          ...action.payload,
          id: generateId()
        }]
      };
    
    case 'UPDATE_STRENGTH_WORKOUT':
      return {
        ...state,
        strengthWorkouts: state.strengthWorkouts.map(workout =>
          workout.id === action.payload.id ? action.payload.workout : workout
        )
      };
    
    case 'DELETE_STRENGTH_WORKOUT':
      return {
        ...state,
        strengthWorkouts: state.strengthWorkouts.filter(workout => workout.id !== action.payload)
      };
    
    case 'ADD_EXERCISE_TO_WORKOUT':
      return {
        ...state,
        strengthWorkouts: state.strengthWorkouts.map(workout =>
          workout.id === action.payload.workoutId
            ? { ...workout, exercises: [...workout.exercises, action.payload.exercise] }
            : workout
        )
      };
    
    case 'DELETE_EXERCISE_FROM_WORKOUT':
      return {
        ...state,
        strengthWorkouts: state.strengthWorkouts.map(workout =>
          workout.id === action.payload.workoutId
            ? {
                ...workout,
                exercises: workout.exercises.filter((_, index) => index !== action.payload.exerciseIndex)
              }
            : workout
        )
      };
    
    case 'DELETE_RUNNING':
      return {
        ...state,
        running: state.running.filter((_, index) => index !== action.payload)
      };
    
    case 'IMPORT_DATA':
      // Handle potential migration from old format
      const migratedData = {
        running: action.payload.running,
        strengthWorkouts: Array.isArray(action.payload.strengthWorkouts) 
          ? action.payload.strengthWorkouts 
          : []
      };
      return migratedData;
    
    case 'RESET_DATA':
      return initialState;
    
    default:
      return state;
  }
}

export function WorkoutProvider({ children }: { children: React.ReactNode }) {
  const [workoutData, dispatch] = useReducer(workoutReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('workoutData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      // Handle migration from old format if necessary
      if (Array.isArray(parsedData.strength)) {
        // Convert old format to new format
        const migratedWorkouts = {
          running: parsedData.running,
          strengthWorkouts: [{
            id: generateId(),
            date: new Date().toISOString().split('T')[0],
            exercises: parsedData.strength
          }]
        };
        dispatch({ type: 'IMPORT_DATA', payload: migratedWorkouts });
      } else {
        dispatch({ type: 'IMPORT_DATA', payload: parsedData });
      }
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('workoutData', JSON.stringify(workoutData));
  }, [workoutData]);

  const exportData = () => {
    const dataStr = JSON.stringify(workoutData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `workout-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importData = (jsonData: string) => {
    try {
      const parsedData = JSON.parse(jsonData);
      dispatch({ type: 'IMPORT_DATA', payload: parsedData });
    } catch (error) {
      console.error('Error importing data:', error);
      throw error;
    }
  };

  const resetData = () => {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      dispatch({ type: 'RESET_DATA' });
    }
  };

  return (
    <WorkoutContext.Provider value={{ workoutData, dispatch, exportData, importData, resetData }}>
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkout() {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
}