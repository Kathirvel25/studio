
"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth, useUser } from "@/firebase";
import {
  User,
  ShieldCheck,
  BookMarked,
  GraduationCap,
  ChevronLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";

const subjectSchema = z.object({
  name: z.string().min(1, "Subject name is required."),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  priority: z.enum(["Low", "Medium", "High"]),
});

const formSchema = z.object({
  // Step 1: Basic Information
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  age: z.coerce.number().min(10, "You must be at least 10 years old."),
  gender: z.enum(["Male", "Female", "Other", "Prefer not to say"]).optional(),

  // Step 2: Academic Details
  educationLevel: z.enum([
    "High School",
    "Diploma",
    "Undergraduate",
    "Postgraduate",
    "Coaching/Competitive Exam",
  ]),
  classYear: z.string().min(1, "This field is required."),
  department: z.string().min(2, "Department/Major is required."),
  institution: z.string().min(2, "Institution name is required."),

  // Step 3: Subjects
  subjects: z.array(subjectSchema).min(1, "Please add at least one subject."),
});

const TOTAL_STEPS = 3;

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      age: "" as any,
      educationLevel: undefined,
      classYear: "",
      department: "",
      institution: "",
      subjects: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "subjects",
  });

  const nextStep = async () => {
    let fieldsToValidate: (keyof z.infer<typeof formSchema>)[] = [];
    if (step === 1) {
      fieldsToValidate = ["fullName", "age", "gender"];
    } else if (step === 2) {
      fieldsToValidate = [
        "educationLevel",
        "classYear",
        "department",
        "institution",
      ];
    } else if (step === 3) {
      fieldsToValidate = ["subjects"];
    }

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      if (step < TOTAL_STEPS) {
        setStep((prev) => prev + 1);
      } else {
        await onSubmit(form.getValues());
      }
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Submitting form...", values);
    toast({
      title: "Profile setup complete!",
      description: "Redirecting you to the dashboard...",
    });
    // Here you would typically save the data to Firestore
    // For now, we'll just redirect
    router.push("/dashboard");
  }

  const progress = (step / TOTAL_STEPS) * 100;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">
              {step === 1 && "Tell us about yourself"}
              {step === 2 && "Your Academic Journey"}
              {step === 3 && "Your Subjects"}
            </CardTitle>
            <div className="flex items-center gap-2 text-muted-foreground">
              {step === 1 && <User className="h-6 w-6" />}
              {step === 2 && <GraduationCap className="h-6 w-6" />}
              {step === 3 && <BookMarked className="h-6 w-6" />}
            </div>
          </div>
          <CardDescription>
            This information helps us tailor your study plan.
          </CardDescription>
          <Progress value={progress} className="mt-2" />
        </CardHeader>

        <Form {...form}>
          <form onSubmit={(e) => e.preventDefault()}>
            <CardContent className="min-h-[300px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  {step === 1 && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Jane Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Age</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="18" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender (Optional)</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                                <SelectItem value="Prefer not to say">
                                  Prefer not to say
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                  {step === 2 && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="educationLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Education Level</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your education level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="High School">
                                  High School
                                </SelectItem>
                                <SelectItem value="Diploma">Diploma</SelectItem>
                                <SelectItem value="Undergraduate">
                                  Undergraduate
                                </SelectItem>
                                <SelectItem value="Postgraduate">
                                  Postgraduate
                                </SelectItem>
                                <SelectItem value="Coaching/Competitive Exam">
                                  Coaching/Competitive Exam
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="classYear"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Class / Year</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., 12th Grade, 2nd Year B.Sc"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="department"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Department / Major</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Computer Science"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name="institution"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Institution Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., University of Example"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                  
                </motion.div>
              </AnimatePresence>
            </CardContent>

            <CardFooter className="flex justify-between">
              {step > 1 ? (
                <Button variant="ghost" onClick={prevStep}>
                  <ChevronLeft className="mr-2 h-4 w-4" /> Back
                </Button>
              ) : (
                <div />
              )}
              <Button onClick={nextStep}>
                {step === TOTAL_STEPS ? "Finish Setup" : "Next"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
        <ShieldCheck className="h-4 w-4" /> Your data is safe and secure.
      </p>
    </div>
  );
}
