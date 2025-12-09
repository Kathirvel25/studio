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
  name: string;
  due: string;
  type: 'Exam' | 'Assignment' | 'Project';
};

type UpcomingDeadlinesProps = {
  deadlines: Deadline[];
};

export function UpcomingDeadlines({ deadlines }: UpcomingDeadlinesProps) {
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
              {deadlines.map((deadline) => (
                <TableRow key={deadline.id}>
                  <TableCell className="font-medium">{deadline.name}</TableCell>
                  <TableCell>
                    <Badge variant={deadline.type === 'Exam' ? 'destructive' : 'secondary'}>{deadline.type}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{format(new Date(deadline.due), "MMM dd, yyyy")}</TableCell>
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
