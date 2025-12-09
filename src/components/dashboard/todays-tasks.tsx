"use client"

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type Task = {
  id: string;
  label: string;
  subject: string;
  done: boolean;
};

type TodaysTasksProps = {
  tasks: Task[];
};

export function TodaysTasks({ tasks }: TodaysTasksProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center space-x-4">
              <Checkbox id={task.id} defaultChecked={task.done} />
              <div className="flex-1">
                <Label htmlFor={task.id} className={`text-sm ${task.done ? 'line-through text-muted-foreground' : ''}`}>
                  {task.label}
                </Label>
              </div>
              <Badge variant="outline">{task.subject}</Badge>
            </div>
          ))}
          {tasks.length === 0 && (
             <p className="text-sm text-muted-foreground">No tasks for today. Enjoy your break!</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
