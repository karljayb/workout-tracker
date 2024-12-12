// Validation utility functions
export const validateTimeFormat = (time: string): boolean => {
    const timeRegex = /^([0-5]?[0-9]):([0-5][0-9])$/;
    return timeRegex.test(time);
  };
  
  export const validateNumberInput = (value: string): boolean => {
    return !isNaN(Number(value)) && Number(value) > 0;
  };
  
  // Add validation for duration in seconds
  export const validateDurationInput = (value: string): boolean => {
    return !isNaN(Number(value)) && Number(value) > 0;
  };
  
  export interface ValidationErrors {
    date?: string;
    distance?: string;
    time?: string;
    duration?: string;
    exercise?: string;
    reps?: string;
    weight?: string;
  }
  
  export interface ExerciseDetail {
    exercise: string;
    reps: string | "duration";  // Use "duration" for duration-based exercises
    duration?: string;  // Duration in seconds
    weight: string | "N/A";
  }
  
  export const validateExercise = (exercise: ExerciseDetail, isWeightNA: boolean): ValidationErrors => {
    const errors: ValidationErrors = {};
  
    if (!exercise.exercise) {
      errors.exercise = "Exercise is required";
    }
  
    const isDurationBasedExercise = exercise.exercise === "Plank";
  
    if (isDurationBasedExercise) {
      if (!exercise.duration) {
        errors.duration = "Duration is required";
      } else if (!validateDurationInput(exercise.duration)) {
        errors.duration = "Duration must be a positive number";
      }
    } else {
      if (!exercise.reps || exercise.reps === "duration") {
        errors.reps = "Reps is required";
      } else if (!validateNumberInput(exercise.reps)) {
        errors.reps = "Reps must be a positive number";
      }
    }
  
    if (!isWeightNA && !exercise.weight) {
      errors.weight = "Weight is required";
    } else if (!isWeightNA && !validateNumberInput(exercise.weight)) {
      errors.weight = "Weight must be a positive number";
    }
  
    return errors;
  };
  
  export const validateRunningEntry = (entry: {
    date: string;
    distance: string;
    time: string;
  }): ValidationErrors => {
    const errors: ValidationErrors = {};
  
    if (!entry.date) {
      errors.date = "Date is required";
    }
  
    if (!entry.distance) {
      errors.distance = "Distance is required";
    } else if (!validateNumberInput(entry.distance)) {
      errors.distance = "Distance must be a positive number";
    }
  
    if (!entry.time) {
      errors.time = "Time is required";
    } else if (!validateTimeFormat(entry.time)) {
      errors.time = "Time must be in mm:ss format";
    }
  
    return errors;
  };
  
  export const validateStrengthWorkout = (date: string, duration?: string): ValidationErrors => {
    const errors: ValidationErrors = {};
  
    if (!date) {
      errors.date = "Date is required";
    }
  
    if (duration && !validateTimeFormat(duration)) {
      errors.duration = "Duration must be in mm:ss format";
    }
  
    return errors;
  };