"use client";

import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useWorkout } from '@/contexts/WorkoutContext';
import { format, parseISO } from 'date-fns';

interface StrengthBest {
  reps?: number;
  duration?: number;
  weight: string;
  date: string;
}

const StatisticsDashboard = () => {
  const { workoutData } = useWorkout();

  // Calculate personal bests
  const personalBests = useMemo(() => {
    if (workoutData.running.length === 0 && workoutData.strengthWorkouts.length === 0) {
      return null;
    }

    // Calculate running bests
    const runningBests = workoutData.running.length > 0 ? {
      longestRun: Math.max(...workoutData.running.map(run => parseFloat(run.distance))),
      fastestPace: Math.min(
        ...workoutData.running
          .map(run => calculatePace(run.time, parseFloat(run.distance)))
          .filter(pace => !isNaN(pace) && isFinite(pace))
      )
    } : null;

    // Calculate strength bests
    const strengthBests = workoutData.strengthWorkouts.reduce((bests, workout) => {
      workout.exercises.forEach(exercise => {
        const exerciseName = exercise.exercise;
        
        if (exerciseName === "Plank") {
          const duration = parseInt(exercise.duration || "0");
          if (!bests[exerciseName] || duration > (bests[exerciseName].duration || 0)) {
            bests[exerciseName] = {
              duration,
              weight: exercise.weight !== 'N/A' ? exercise.weight : 'N/A',
              date: workout.date
            };
          }
        } else {
          const reps = parseInt(exercise.reps);
          if (!bests[exerciseName] || reps > (bests[exerciseName].reps || 0)) {
            bests[exerciseName] = {
              reps,
              weight: exercise.weight !== 'N/A' ? exercise.weight : 'N/A',
              date: workout.date
            };
          }
        }
      });
      return bests;
    }, {} as Record<string, StrengthBest>);

    return {
      running: runningBests,
      strength: strengthBests
    };
  }, [workoutData]);

  // Calculate weekly stats
  const weeklyStats = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const lastWeekRuns = workoutData.running.filter(run => {
      const runDate = new Date(run.date);
      return runDate >= weekAgo;
    });

    const lastWeekStrength = workoutData.strengthWorkouts.filter(workout => {
      const workoutDate = new Date(workout.date);
      return workoutDate >= weekAgo;
    });

    return {
      totalDistance: lastWeekRuns.reduce((sum, run) => sum + parseFloat(run.distance), 0),
      totalWorkouts: lastWeekRuns.length + lastWeekStrength.length,
      strengthWorkouts: lastWeekStrength.length,
      totalExercises: lastWeekStrength.reduce((sum, workout) => sum + workout.exercises.length, 0),
      averageExercisesPerWorkout: lastWeekStrength.length > 0 
        ? lastWeekStrength.reduce((sum, workout) => sum + workout.exercises.length, 0) / lastWeekStrength.length 
        : 0
    };
  }, [workoutData]);

  if (workoutData.running.length === 0 && workoutData.strengthWorkouts.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            No workout data available. Start tracking your workouts to see statistics!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Weekly Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Last 7 Days</h3>
              <ul className="space-y-2">
                <li>Total Distance: {weeklyStats.totalDistance.toFixed(1)} km</li>
                <li>Total Workouts: {weeklyStats.totalWorkouts}</li>
                <li>Strength Workouts: {weeklyStats.strengthWorkouts}</li>
                <li>Total Exercises: {weeklyStats.totalExercises}</li>
                <li>Avg Exercises per Workout: {weeklyStats.averageExercisesPerWorkout.toFixed(1)}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Latest Running Progress */}
      {workoutData.running.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Latest Running Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {workoutData.running.slice(-5).reverse().map((run, index) => (
                <div key={index} className="flex justify-between items-center p-2 border-b">
                  <span>{format(parseISO(run.date), 'dd/MM/yyyy')}</span>
                  <span>{run.distance} km</span>
                  <span>{run.time}</span>
                  <span>{formatPace(calculatePace(run.time, parseFloat(run.distance)))} min/km</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Latest Strength Progress */}
      {workoutData.strengthWorkouts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Latest Strength Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {workoutData.strengthWorkouts.slice(-5).reverse().map((workout, index) => (
                <div key={index} className="mb-4">
                  <div className="font-medium mb-2">
                    {format(parseISO(workout.date), 'MMM d, yyyy')}
                    {workout.duration && ` - Duration: ${workout.duration}`}
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-2">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left">Exercise</th>
                        <th className="text-left">Reps/Duration</th>
                        <th className="text-left">Weight</th>
                      </tr>
                    </thead>
                    <tbody>
                      {workout.exercises.map((exercise, exIndex) => (
                        <tr key={exIndex} className="border-t border-secondary-foreground/20">
                          <td className="py-1">{exercise.exercise}</td>
                          <td className="py-1">
                            {exercise.exercise === "Plank" 
                              ? `${exercise.duration}s`
                              : exercise.reps + " reps"
                            }
                          </td>
                          <td className="py-1">{exercise.weight}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Personal Bests */}
      {personalBests && (
        <Card>
          <CardHeader>
            <CardTitle>Personal Bests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {personalBests.running && (
                <div>
                  <h3 className="font-semibold mb-2">Running</h3>
                  <ul className="space-y-2">
                    <li>Longest Run: {personalBests.running.longestRun} km</li>
                    <li>
                      Fastest Pace: {formatPace(personalBests.running.fastestPace)} min/km
                    </li>
                  </ul>
                </div>
              )}
              {Object.keys(personalBests.strength).length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Strength</h3>
                  <ul className="space-y-2">
                    {Object.entries(personalBests.strength).map(([exercise, stats]) => (
                      <li key={exercise}>
                        {exercise}: {
                          exercise === "Plank"
                            ? `${stats.duration}s`
                            : `${stats.reps} reps`
                        }
                        {stats.weight !== 'N/A' && ` @ ${stats.weight}kg`}
                        <span className="text-sm text-muted-foreground ml-2">
                          ({format(parseISO(stats.date), 'dd/MM')})
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Utility functions
function calculatePace(time: string, distance: number): number {
  const [minutes, seconds] = time.split(':').map(Number);
  const totalMinutes = minutes + seconds / 60;
  return totalMinutes / distance;
}

function formatPace(pace: number): string {
  const minutes = Math.floor(pace);
  const seconds = Math.round((pace - minutes) * 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default StatisticsDashboard;