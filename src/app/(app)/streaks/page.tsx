import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Flame, Star, Zap, Award } from "lucide-react";
import { streak } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

const achievements = [
    { icon: Star, title: "7-Day Streak", description: "Maintain a study streak for 7 consecutive days.", unlocked: true },
    { icon: Award, title: "30-Day Streak", description: "Keep the flame alive for a whole month!", unlocked: false },
    { icon: Zap, title: "Perfect Week", description: "Complete all your tasks for 7 days in a row.", unlocked: true },
    { icon: Star, title: "Weekend Warrior", description: "Study on a Saturday and Sunday.", unlocked: true },
    { icon: Award, title: "100-Day Club", description: "Join the elite club of 100-day studiers.", unlocked: false },
    { icon: Zap, title: "Early Bird", description: "Complete a task before 8 AM.", unlocked: false },
]

export default function StreaksPage() {
  const longestStreak = 25; // Placeholder
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;
  const totalAchievements = achievements.length;

  return (
    <div className="space-y-4 p-4 md:p-8">
      <h2 className="text-3xl font-bold tracking-tight">Streaks & Achievements</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame />
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold">{streak} Days</div>
            <p className="text-primary-foreground/80 mt-1">Keep the fire going!</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Longest Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold">{longestStreak} Days</div>
            <p className="text-muted-foreground mt-1">Your personal best.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Achievements Unlocked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold">{unlockedAchievements} / {totalAchievements}</div>
            <p className="text-muted-foreground mt-1">Gotta catch 'em all!</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Badges</CardTitle>
          <CardDescription>Badges you've earned for your hard work and consistency.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {achievements.map((achievement, index) => (
            <div key={index} className={`flex flex-col items-center text-center p-4 rounded-lg transition-opacity ${achievement.unlocked ? 'opacity-100' : 'opacity-40'}`}>
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-2 ${achievement.unlocked ? 'bg-primary/10' : 'bg-muted'}`}>
                <achievement.icon className={`w-10 h-10 ${achievement.unlocked ? 'text-primary' : 'text-muted-foreground'}`} />
              </div>
              <h3 className="font-semibold text-md">{achievement.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
              {!achievement.unlocked && <Badge variant="outline" className="mt-2">Locked</Badge>}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
