import { Flame } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type StreakCounterProps = {
  streak: number;
};

export function StreakCounter({ streak }: StreakCounterProps) {
  return (
    <Card className="transition-transform transform hover:scale-105">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
        <Flame className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{streak} days</div>
        <p className="text-xs text-muted-foreground">Keep up the great work!</p>
      </CardContent>
    </Card>
  );
}
