
import { StreakCounter } from "@/components/dashboard/streak-counter";
import { TodaysTasks } from "@/components/dashboard/todays-tasks";
import { WeeklyProgress } from "@/components/dashboard/weekly-progress";
import { ProgressOverviewChart } from "@/components/dashboard/progress-overview-chart";
import { UpcomingDeadlines } from "@/components/dashboard/upcoming-deadlines";
import { SuggestedVideos } from "@/components/dashboard/suggested-videos";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { streak, weeklyProgress, progressChartData, todaysTasks, upcomingDeadlines, learningSubjects } from "@/lib/data";
import { XPCard } from "../gamification/xp-card";

export default function DashboardPage() {
  const userStats = {
    totalXP: 2580,
    currentLevel: 5,
    xpToNextLevel: 500,
  }

  return (
    <div className="space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StreakCounter streak={streak} />
        <XPCard stats={userStats} />
        <Card className="transition-transform transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{todaysTasks.filter(t => t.done).length} / {todaysTasks.length}</div>
                <p className="text-xs text-muted-foreground">today</p>
            </CardContent>
        </Card>
        <Card className="transition-transform transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{upcomingDeadlines.length}</div>
                <p className="text-xs text-muted-foreground">in the next 30 days</p>
            </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <ProgressOverviewChart data={progressChartData} />
        </div>
        <div className="lg:col-span-3">
          <TodaysTasks tasks={todaysTasks} />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <UpcomingDeadlines deadlines={upcomingDeadlines} />
        <SuggestedVideos subjects={learningSubjects} />
      </div>
    </div>
  );
}
