
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, updateDocumentNonBlocking } from '@/firebase';
import { collection, Timestamp, doc } from 'firebase/firestore';
import { differenceInDays } from 'date-fns';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  type: z.enum(['Assignment', 'Exam', 'Project', 'Study Session', 'Other']),
  subject: z.string().optional(),
  daysUntilDue: z.coerce.number().min(0, 'Please enter a valid number of days.'),
  priority: z.enum(['Low', 'Medium', 'High']).default('Medium'),
  estimatedTime: z.coerce.number().optional(),
  description: z.string().optional(),
});

type Task = {
  id: string;
  title: string;
  dueDate: { toDate: () => Date };
  type: 'Exam' | 'Assignment' | 'Project' | 'Study Session' | 'Other';
  subject?: string;
  priority?: 'Low' | 'Medium' | 'High';
  estimatedTime?: number;
  description?: string;
}

type EditTaskDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  task: Task;
};

export function EditTaskDialog({
  isOpen,
  setIsOpen,
  task,
}: EditTaskDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
        title: '',
        type: 'Assignment',
        priority: 'Medium',
        estimatedTime: undefined,
        description: '',
        subject: '',
        daysUntilDue: 0,
    },
  });

  useEffect(() => {
    if (task) {
      const daysUntil = differenceInDays(task.dueDate.toDate(), new Date());
      form.reset({
        title: task.title,
        type: task.type,
        subject: task.subject || '',
        daysUntilDue: daysUntil >= 0 ? daysUntil : 0,
        priority: task.priority || 'Medium',
        estimatedTime: task.estimatedTime,
        description: task.description || '',
      });
    }
  }, [task, form]);

  async function onSubmit(values: z.infer<typeof taskSchema>) {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to update a task.',
      });
      return;
    }
    setIsSubmitting(true);

    try {
      const taskDocRef = doc(firestore, `users/${user.uid}/tasks/${task.id}`);
      
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + values.daysUntilDue);

      updateDocumentNonBlocking(taskDocRef, {
        title: values.title,
        type: values.type,
        subject: values.subject || null,
        dueDate: Timestamp.fromDate(dueDate),
        priority: values.priority,
        estimatedTime: values.estimatedTime,
        description: values.description,
      });

      toast({
        title: 'Task updated!',
        description: `${values.title} has been updated.`,
      });

      form.reset();
      setIsOpen(false);
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        variant: 'destructive',
        title: 'Something went wrong',
        description: 'Could not update the task. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Update the details of your task. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Complete math homework" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
               <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select task type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Assignment">Assignment</SelectItem>
                        <SelectItem value="Exam">Exam</SelectItem>
                        <SelectItem value="Project">Project</SelectItem>
                        <SelectItem value="Study Session">Study Session</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., Physics" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <FormField
                control={form.control}
                name="daysUntilDue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Days Until Due</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 7" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="estimatedTime"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Est. Time (minutes)</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="e.g., 60" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                        <Textarea placeholder="Add any extra details..." {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
