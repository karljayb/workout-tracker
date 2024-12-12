import WorkoutTracker from '@/components/WorkoutTracker'
import StatisticsDashboard from '@/components/StatisticsDashboard'
import { ThemeToggle } from '@/components/theme-toggle'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Workout Tracker</h1>
        <ThemeToggle />
      </div>
      <Tabs defaultValue="tracker" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="tracker">Tracker</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>
        <TabsContent value="tracker">
          <WorkoutTracker />
        </TabsContent>
        <TabsContent value="stats">
          <StatisticsDashboard />
        </TabsContent>
      </Tabs>
    </main>
  )
}