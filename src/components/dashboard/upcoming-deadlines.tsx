
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { doc } from "firebase/firestore";
import { useFirestore, useUser, deleteDocumentNonBlocking } from "@/firebase";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { EditTaskDialog } from "../tasks/edit-task-dialog";

type Deadline = {
  id: string;
  title: string;
  dueDate: { toDate: () => Date }; // Firestore Timestamp
  type: 'Exam' | 'Assignment' | 'Project' | 'Study Session' | 'Other';
  subject?: string;
  priority?: 'Low' | 'Medium' | 'High';
  estimatedTime?: number;
  description?: string;
};

type UpcomingDeadlinesProps = {
  deadlines: Deadline[];
  onAddTask: () => void;
};

export function UpcomingDeadlines({ deadlines, onAddTask }: UpcomingDeadlinesProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const [editingTask, setEditingTask] = useState<Deadline | null>(null);

  const sortedDeadlines = deadlines.sort((a, b) => a.dueDate.toDate().getTime() - b.dueDate.toDate().getTime());

  const handleDelete = (taskId: string) => {
    if (!user) return;
    if (window.confirm("Are you sure you want to delete this task?")) {
        const taskRef = doc(firestore, `users/${user.uid}/tasks/${taskId}`);
        deleteDocumentNonBlocking(taskRef);
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Deadlines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto max-h-[300px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedDeadlines.length > 0 ? (
                  sortedDeadlines.map((deadline) => (
                    <TableRow key={deadline.id}>
                      <TableCell className="font-medium">{deadline.title}</TableCell>
                      <TableCell>
                        <Badge variant={deadline.type === 'Exam' ? 'destructive' : 'secondary'}>{deadline.type}</Badge>
                      </TableCell>
                      <TableCell>{format(deadline.dueDate.toDate(), "MMM dd, yyyy")}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => setEditingTask(deadline)}>
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(deadline.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                            <p className="text-muted-foreground">No upcoming deadlines.</p>
                            <Button variant="link" onClick={onAddTask}>Add a deadline</Button>
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {editingTask && (
        <EditTaskDialog
            isOpen={!!editingTask}
            setIsOpen={(isOpen) => !isOpen && setEditingTask(null)}
            task={editingTask}
        />
      )}
    </>
  );
}
