import WorkoutTracker from '@/components/WorkoutTracker'
import StatisticsDashboard from '@/components/StatisticsDashboard'
import { ThemeToggle } from '@/components/theme-toggle'
import { UserMenu } from '@/components/UserMenu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-6 px-4 space-y-8">
        {/* Enhanced Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold tracking-tight">My Workout Tracker</h1>
          <div className="flex items-center gap-4">
            <UserMenu />
            <ThemeToggle />
          </div>
        </div>
        
        {/* Enhanced Tabs */}
        <Tabs defaultValue="tracker" className="space-y-6">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="tracker">Tracker</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>
          <TabsContent value="tracker" className="space-y-6">
            <WorkoutTracker />
          </TabsContent>
          <TabsContent value="stats" className="space-y-6">
            <StatisticsDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}