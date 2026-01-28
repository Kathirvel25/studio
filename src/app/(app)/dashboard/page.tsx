

"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { StreakCounter } from "@/components/dashboard/streak-counter";
import { TodaysTasks } from "@/components/dashboard/todays-tasks";
import { UpcomingDeadlines } from "@/components/dashboard/upcoming-deadlines";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase } from "@/firebase";
import { doc, collection, query, where, Timestamp } from "firebase/firestore";
import { XPCard } from "@/components/gamification/xp-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog";
import { Skeleton } from "@/components/ui/skeleton";

const ProgressOverviewChart = dynamic(
  () => import('@/components/dashboard/progress-overview-chart').then(mod => mod.ProgressOverviewChart),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[350px]" />,
  }
);

const SuggestedVideos = dynamic(
  () => import('@/components/dashboard/suggested-videos').then(mod => mod.SuggestedVideos),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[400px]" />,
  }
);


export default function DashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [isCreateTaskOpen, setCreateTaskOpen] = useState(false);

  const userProfileRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'users', user.uid, 'userProfiles', user.uid);
  }, [user, firestore]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc(userProfileRef);

  const tasksQuery = useMemoFirebase(() => {
    if (!user) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return query(
      collection(firestore, `users/${user.uid}/tasks`),
      where("dueDate", ">=", Timestamp.fromDate(today)),
      where("dueDate", "<", Timestamp.fromDate(tomorrow))
    );
  }, [user, firestore]);
  
  const { data: todaysTasks, isLoading: areTasksLoading } = useCollection(tasksQuery);

  const deadlinesQuery = useMemoFirebase(() => {
    if(!user) return null;
    return query(
        collection(firestore, `users/${user.uid}/tasks`),
        where("isCompleted", "==", false)
    );
  }, [user, firestore]);
  
  const { data: upcomingDeadlines, isLoading: areDeadlinesLoading } = useCollection(deadlinesQuery);
  

  const userStats = {
    totalXP: (userProfile as any)?.totalXP || 0,
    currentLevel: (userProfile as any)?.currentLevel || 1,
    xpToNextLevel: 500, // This could be dynamic later
  };

  const streak = (userProfile as any)?.streak || 0;
  
  const progressChartData = [
    { day: 'Mon', hours: 2.5 },
    { day: 'Tue', hours: 3 },
    { day: 'Wed', hours: 4 },
    { day: 'Thu', hours: 2 },
    { day: 'Fri', hours: 3.5 },
    { day: 'Sat', hours: 5 },
    { day: 'Sun', hours: 1.5 },
  ];

  if (isProfileLoading || areTasksLoading || areDeadlinesLoading) {
    return <div className="flex h-screen w-full items-center justify-center">Loading dashboard...</div>
  }

  const learningSubjects = (userProfile as any)?.subjects?.map((s: any) => s.name) || [];
  
  return (
    <>
    <div className="space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div 
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        <div className="transition-transform transform hover:scale-105"><StreakCounter streak={streak} /></div>
        <div className="transition-transform transform hover:scale-105"><XPCard stats={userStats} /></div>
        <div className="transition-transform transform hover:scale-105">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{(todaysTasks || []).filter(t => t.isCompleted).length} / {(todaysTasks || []).length}</div>
                    <p className="text-xs text-muted-foreground">today</p>
                </CardContent>
            </Card>
        </div>
        <div className="transition-transform transform hover:scale-105">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{(upcomingDeadlines || []).length}</div>
                    <p className="text-xs text-muted-foreground">in total</p>
                </CardContent>
            </Card>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <ProgressOverviewChart data={progressChartData} />
        </div>
        <div className="lg:col-span-3">
          <TodaysTasks tasks={todaysTasks || []} onAddTask={() => setCreateTaskOpen(true)} />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <UpcomingDeadlines deadlines={upcomingDeadlines || []} onAddTask={() => setCreateTaskOpen(true)}/>
        <SuggestedVideos subjects={learningSubjects} />
      </div>
    </div>
    <CreateTaskDialog 
        isOpen={isCreateTaskOpen} 
        setIsOpen={setCreateTaskOpen} 
        subjects={learningSubjects}
    />
    <Button 
        className="fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-lg"
        onClick={() => setCreateTaskOpen(true)}
    >
        <Plus className="h-8 w-8" />
    </Button>
    </>
  );
}
