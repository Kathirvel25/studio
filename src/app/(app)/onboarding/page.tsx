"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  learningSubjects: z.string().min(1, "Please enter at least one subject."),
  upcomingTasks: z.string().min(1, "Please list some upcoming tasks."),
  studyTime: z.string().min(1, "Please enter your daily study time goal."),
});

export default function OnboardingPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      learningSubjects: "",
      upcomingTasks: "",
      studyTime: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real app, you would save this data to a database.
    console.log("Onboarding data:", values);
    toast({
      title: "Welcome!",
      description: "Your study plan is set up. Let's get started!",
    });
    router.push("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to StudyMate!</CardTitle>
          <CardDescription>
            Let's set up your study plan. Tell us a bit about your goals.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="learningSubjects"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What are you learning?</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Math, History, Physics"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      List the subjects you are currently studying.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="upcomingTasks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upcoming Tasks or Deadlines</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Chapter 3 homework, Mid-term exam on the 15th..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      List a few initial tasks to get you started.
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
                    <FormLabel>Daily Study Time Goal</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 2 hours" {...field} />
                    </FormControl>
                    <FormDescription>
                      How much time do you plan to study each day?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Start My Study Journey
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
