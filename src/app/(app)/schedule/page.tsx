"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, BookOpen, Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { upcomingDeadlines } from "@/lib/data";

type Deadline = {
  id: string;
  name: string;
  due: string;
  type: "Exam" | "Assignment" | "Project";
};

export default function SchedulePage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const deadlinesByDate = upcomingDeadlines.reduce((acc, deadline) => {
    const date = format(new Date(deadline.due), "yyyy-MM-dd");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(deadline);
    return acc;
  }, {} as Record<string, Deadline[]>);

  const selectedDateString = date ? format(date, "yyyy-MM-dd") : "";
  const selectedDayDeadlines = deadlinesByDate[selectedDateString] || [];

  return (
    <div className="space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Schedule</h2>
      </div>
      <p className="text-muted-foreground">
        Here's your study schedule. Click on a date to see the deadlines for
        that day.
      </p>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-2">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md"
                modifiers={{
                  highlighted: upcomingDeadlines.map((d) => new Date(d.due)),
                }}
                modifiersStyles={{
                  highlighted: {
                    border: "2px solid hsl(var(--primary))",
                    borderRadius: "var(--radius)",
                  },
                }}
              />
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                <span>
                  {date ? format(date, "MMMM dd, yyyy") : "Select a date"}
                </span>
              </CardTitle>
              <CardDescription>Deadlines for the selected day</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedDayDeadlines.length > 0 ? (
                <div className="space-y-4">
                  {selectedDayDeadlines.map((deadline) => (
                    <div key={deadline.id} className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <Badge
                          variant={
                            deadline.type === "Exam"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {deadline.type}
                        </Badge>
                      </div>
                      <div>
                        <p className="font-semibold">{deadline.name}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                           <Clock className="h-3 w-3" /> Due on {format(new Date(deadline.due), "p")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-10">
                  <BookOpen className="h-10 w-10 mb-4" />
                  <p>No deadlines for this day.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
