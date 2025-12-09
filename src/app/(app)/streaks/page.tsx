import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Flame } from "lucide-react";

export default function StreaksPage() {
  return (
    <div className="space-y-4 p-4 md:p-8">
      <h2 className="text-3xl font-bold tracking-tight">Streaks & Achievements</h2>
      <Card className="flex flex-col items-center justify-center text-center p-8 min-h-[400px]">
        <Flame className="w-16 h-16 text-muted-foreground mb-4" />
        <CardHeader>
          <CardTitle>Streak Tracking Coming Soon</CardTitle>
          <CardDescription>
            Visualize your study consistency and earn badges for your hard work.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Track your daily study streak and unlock achievements for milestones like 7-day, 30-day, and 100-day streaks!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
