"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BrainCircuit, Loader2 } from "lucide-react";
import { WeeklyFeedbackOutput } from "@/ai/flows/ai-weekly-smart-feedback";
import { getAIFeedback } from "@/app/(app)/ai-feedback/actions";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  completedTasks: z.string().min(1, "Please list your completed tasks."),
  missedTasks: z.string().min(1, "Please list any missed tasks."),
  studyTime: z.string().min(1, "Please enter your total study time."),
  difficultyLevels: z
    .string()
    .min(1, "Describe the difficulty of your tasks."),
});

export function AIFeedbackClient() {
  const [feedback, setFeedback] = useState<WeeklyFeedbackOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      completedTasks: "",
      missedTasks: "",
      studyTime: "",
      difficultyLevels: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setFeedback(null);
    try {
      const result = await getAIFeedback(values);
      if (result) {
        setFeedback(result);
      } else {
        throw new Error("Failed to get feedback.");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description:
          "Could not generate feedback. Please check your input and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Your Weekly Input</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="completedTasks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Completed Tasks</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Finished Chapter 1 of Physics, Submitted Math homework..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      List the tasks you completed this week.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="missedTasks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Missed or Incomplete Tasks</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Postponed history reading, Skipped biology review..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      List any tasks you didn't get to.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="studyTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Study Time</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Around 15 hours" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="difficultyLevels"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Difficulty</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Math was very difficult, Physics was manageable..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      How challenging were the subjects this week?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <BrainCircuit className="mr-2 h-4 w-4" />
                )}
                Generate Feedback
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>AI Generated Report</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow flex items-center justify-center">
          {isLoading ? (
            <div className="flex flex-col items-center gap-4 text-muted-foreground">
              <Loader2 className="h-12 w-12 animate-spin" />
              <p>Analyzing your week...</p>
            </div>
          ) : feedback ? (
            <div className="prose prose-sm dark:prose-invert max-w-none text-foreground whitespace-pre-wrap font-body">
              {feedback.report}
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              <p>Your weekly report will appear here once generated.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
