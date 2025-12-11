

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
import { useFirestore, useUser, updateDocumentNonBlocking } from "@/firebase";
import { doc } from "firebase/firestore";
import { Button } from "../ui/button";

type Task = {
  id: string;
  title: string;
  subject: string;
  isCompleted: boolean;
};

type TodaysTasksProps = {
  tasks: Task[];
  onAddTask: () => void;
};

export function TodaysTasks({ tasks, onAddTask }: TodaysTasksProps) {
  const { user } = useUser();
  const firestore = useFirestore();

  const handleTaskToggle = (taskId: string, currentStatus: boolean) => {
    if (user) {
      const taskRef = doc(firestore, `users/${user.uid}/tasks/${taskId}`);
      updateDocumentNonBlocking(taskRef, { isCompleted: !currentStatus });
      // Here you could add logic to award XP
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center space-x-4">
              <Checkbox 
                id={task.id} 
                checked={task.isCompleted} 
                onCheckedChange={() => handleTaskToggle(task.id, task.isCompleted)}
              />
              <div className="flex-1">
                <Label htmlFor={task.id} className={`text-sm ${task.isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                  {task.title}
                </Label>
              </div>
              <Badge variant="outline">{task.subject}</Badge>
            </div>
          ))}
          {tasks.length === 0 && (
            <div className="text-center text-muted-foreground py-4">
                <p>No tasks for today. Enjoy your break!</p>
                <Button variant="link" onClick={onAddTask}>Add your first task</Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
