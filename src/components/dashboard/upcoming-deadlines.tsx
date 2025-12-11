
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

type Deadline = {
  id: string;
  title: string;
  dueDate: { toDate: () => Date }; // Firestore Timestamp
  type: 'Exam' | 'Assignment' | 'Project' | 'Study' | 'Quiz' | 'Other';
};

type UpcomingDeadlinesProps = {
  deadlines: Deadline[];
};

export function UpcomingDeadlines({ deadlines }: UpcomingDeadlinesProps) {

  const sortedDeadlines = deadlines.sort((a, b) => a.dueDate.toDate().getTime() - b.dueDate.toDate().getTime());

  return (
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
                <TableHead className="text-right">Due Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedDeadlines.map((deadline) => (
                <TableRow key={deadline.id}>
                  <TableCell className="font-medium">{deadline.title}</TableCell>
                  <TableCell>
                    <Badge variant={deadline.type === 'Exam' ? 'destructive' : 'secondary'}>{deadline.type}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{format(deadline.dueDate.toDate(), "MMM dd, yyyy")}</TableCell>
                </TableRow>
              ))}
              {deadlines.length === 0 && (
                  <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground h-24">
                          No upcoming deadlines.
                      </TableCell>
                  </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
