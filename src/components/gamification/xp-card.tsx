
"use client";

import { Award } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

type XPCardProps = {
  stats: {
    totalXP: number;
    currentLevel: number;
    xpToNextLevel: number;
  };
};

export function XPCard({ stats }: XPCardProps) {
  const xpForCurrentLevel = stats.totalXP % stats.xpToNextLevel;
  const progressPercentage = (xpForCurrentLevel / stats.xpToNextLevel) * 100;
  
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const animation = setTimeout(() => setAnimatedProgress(progressPercentage), 500);
    return () => clearTimeout(animation);
  }, [progressPercentage]);


  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
            <span>Level {stats.currentLevel}</span>
            <Award className="h-4 w-4 text-muted-foreground" />
        </CardTitle>
        <CardDescription>
          {stats.xpToNextLevel - xpForCurrentLevel} XP to next level
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stats.totalXP.toLocaleString()} XP</div>
        <Progress value={animatedProgress} className="mt-2 h-2" />
      </CardContent>
    </Card>
  );
}
