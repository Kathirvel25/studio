
"use client";

import { useState, useRef } from "react";
import { Loader2, Upload, BrainCircuit, Check, X, BookOpen, Lightbulb, PartyPopper, Award, XCircle } from "lucide-react";
import { generateMcq } from "@/app/(app)/quiz/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { GenerateMcqOutput } from "@/ai/flows/generate-mcq";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import Image from "next/image";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { motion } from "framer-motion";

type QuizState = 'idle' | 'loading' | 'quiz' | 'result';
type Answer = { questionIndex: number; selectedOption: number };

const PASS_PERCENTAGE = 70;

export function QuizClient() {
  const [textContent, setTextContent] = useState("");
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const [topic, setTopic] = useState("");
  const [numQuestions, setNumQuestions] = useState("5");
  const [quiz, setQuiz] = useState<GenerateMcqOutput | null>(null);
  const [quizState, setQuizState] = useState<QuizState>('idle');
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [score, setScore] = useState(0);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState("paste");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImageDataUri(e.target?.result as string);
        };
        reader.readAsDataURL(selectedFile);
        setTextContent(""); // Clear text content when image is uploaded
      } else if (selectedFile.type === "text/plain") {
        const reader = new FileReader();
        reader.onload = (e) => {
          setTextContent(e.target?.result as string);
        };
        reader.readAsText(selectedFile);
        setImageDataUri(null);
      } else {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload a .txt or image file.",
        });
      }
    }
  };
  
  const handlePaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        if (blob) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setImageDataUri(e.target?.result as string);
            setTextContent(''); // Clear text if image is pasted
          };
          reader.readAsDataURL(blob);
          event.preventDefault(); // Prevent pasting image as text
          return;
        }
      }
    }
  };

  const handleGenerateQuiz = async () => {
    if (activeTab === "paste" && !textContent && !imageDataUri) {
        toast({ variant: "destructive", title: "No content", description: "Please paste text, an image, or upload a file." });
        return;
    }
    if (activeTab === "ai" && !topic) {
        toast({ variant: "destructive", title: "No Topic", description: "Please enter a topic to generate a quiz." });
        return;
    }


    setQuizState('loading');
    setQuiz(null);
    setAnswers([]);
    setScore(0);

    try {
      const input = activeTab === 'ai' 
        ? { topic, numQuestions: parseInt(numQuestions) } 
        : { documentContent: textContent, imageDataUri: imageDataUri || undefined, numQuestions: parseInt(numQuestions) };
      
      const result = await generateMcq(input);
      if (result && result.questions.length > 0) {
        setQuiz(result);
        setQuizState('quiz');
      } else {
        throw new Error("Failed to generate quiz.");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Could not generate the quiz. Please try again.",
      });
      setQuizState('idle');
    }
  };

  const handleAnswerChange = (questionIndex: number, optionIndex: number) => {
    const existingAnswer = answers.find(a => a.questionIndex === questionIndex);
    if (existingAnswer) {
      setAnswers(answers.map(a => a.questionIndex === questionIndex ? { ...a, selectedOption: optionIndex } : a));
    } else {
      setAnswers([...answers, { questionIndex, selectedOption: optionIndex }]);
    }
  };

  const handleSubmitQuiz = () => {
    if (answers.length !== quiz?.questions.length) {
      toast({
        variant: "destructive",
        title: "Incomplete Quiz",
        description: "Please answer all questions before submitting.",
      });
      return;
    }

    let correctAnswers = 0;
    quiz?.questions.forEach((q, index) => {
      const userAnswer = answers.find(a => a.questionIndex === index);
      if (userAnswer && userAnswer.selectedOption === q.correctAnswerIndex) {
        correctAnswers++;
      }
    });
    
    const finalScore = (correctAnswers / (quiz?.questions.length || 1)) * 100;
    setScore(finalScore);
    setQuizState('result');
  };

  const handleTryAgain = () => {
    setQuizState('idle');
    setQuiz(null);
    setTextContent('');
    setImageDataUri(null);
    setTopic('');
    setAnswers([]);
    setScore(0);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };
  
  const getOptionLabelClassName = (isCorrect: boolean, isSelected: boolean, isSubmitted: boolean) => {
    if (!isSubmitted) return 'cursor-pointer';
    if (isCorrect) return 'text-green-600 font-bold';
    if (isSelected && !isCorrect) return 'text-red-600 line-through';
    return 'text-muted-foreground';
  };

  if (quizState === 'loading') {
    return (
      <Card className="flex flex-col items-center justify-center p-8 min-h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Generating your quiz...</p>
      </Card>
    );
  }

  if (quizState === 'quiz' && quiz) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <CardTitle>Quiz Time!</CardTitle>
            <CardDescription>Answer the questions below to test your knowledge.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {quiz.questions.map((q, qIndex) => (
              <motion.div key={qIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: qIndex * 0.1 }}>
                <p className="font-semibold mb-4">{qIndex + 1}. {q.question}</p>
                <RadioGroup onValueChange={(value) => handleAnswerChange(qIndex, parseInt(value))}>
                  {q.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted transition-colors">
                      <RadioGroupItem value={oIndex.toString()} id={`q${qIndex}o${oIndex}`} />
                      <Label htmlFor={`q${qIndex}o${oIndex}`} className="cursor-pointer flex-1">{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </motion.div>
            ))}
            <Button onClick={handleSubmitQuiz} className="w-full">
              Submit Quiz
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (quizState === 'result') {
    const isPassed = score >= PASS_PERCENTAGE;
    const isPerfect = score === 100;
    return (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <Card>
                <CardHeader className="text-center">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1, rotate: [0, 10, -10, 0] }} transition={{ type: "spring", stiffness: 300, damping: 10 }}>
                        {isPerfect ? <PartyPopper className="w-16 h-16 text-yellow-500 mx-auto" /> : isPassed ? <Award className="w-16 h-16 text-green-500 mx-auto" /> : <XCircle className="w-16 h-16 text-red-500 mx-auto" />}
                    </motion.div>
                    <CardTitle className="text-3xl mt-4">Quiz Complete!</CardTitle>
                    <CardDescription>You scored</CardDescription>
                    <p className={`text-6xl font-bold ${isPassed ? 'text-green-600' : 'text-red-600'}`}>{Math.round(score)}%</p>
                </CardHeader>
                <CardContent className="space-y-8">
                    {isPerfect ? (
                        <div className="text-center text-lg font-medium text-yellow-500">Perfect Score! Amazing work!</div>
                    ) : (
                        <div className="text-center text-lg font-medium">{isPassed ? "Congratulations, you passed!" : "You can do better. Keep studying!"}</div>
                    )}
                    
                    <div className="space-y-6">
                        <h3 className="font-bold text-lg flex items-center"><BookOpen className="mr-2 h-5 w-5" />Review Your Answers</h3>
                        {quiz?.questions.map((q, qIndex) => {
                            const userAnswer = answers.find(a => a.questionIndex === qIndex);
                            return (
                                <motion.div key={qIndex} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: qIndex * 0.1 }} className="p-4 border rounded-lg">
                                    <p className="font-semibold mb-2">{qIndex + 1}. {q.question}</p>
                                    <div className="space-y-1">
                                        {q.options.map((option, oIndex) => (
                                            <div key={oIndex} className="flex items-center gap-2">
                                                {oIndex === q.correctAnswerIndex ? <Check className="h-4 w-4 text-green-600 flex-shrink-0" /> : <X className="h-4 w-4 text-red-600 flex-shrink-0" />}
                                                <Label className={getOptionLabelClassName(oIndex === q.correctAnswerIndex, oIndex === userAnswer?.selectedOption, true)}>
                                                    {option}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                    
                    <Button onClick={handleTryAgain} className="w-full">
                        <Lightbulb className="mr-2 h-4 w-4" />
                        Create a New Quiz
                    </Button>
                </CardContent>
            </Card>
        </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
            <CardHeader>
                <CardTitle>Create Your Quiz</CardTitle>
                <CardDescription>Use your notes, an image, or let AI generate a quiz from a topic.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="paste" onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="paste">Paste Content</TabsTrigger>
                        <TabsTrigger value="upload">Upload File</TabsTrigger>
                        <TabsTrigger value="ai">Generate with AI</TabsTrigger>
                    </TabsList>
                    <TabsContent value="paste" className="mt-4">
                        <Textarea 
                            placeholder="Paste your study notes or an image here..."
                            value={textContent}
                            onChange={(e) => {
                                setTextContent(e.target.value);
                                setImageDataUri(null);
                            }}
                            onPaste={handlePaste}
                            className="h-48"
                        />
                        {imageDataUri && (
                            <div className="mt-4 relative w-full h-48">
                                <Image src={imageDataUri} alt="Pasted content" layout="fill" objectFit="contain" />
                                <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => setImageDataUri(null)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent value="upload" className="mt-4">
                        <div className="flex items-center space-x-2 p-4 border-2 border-dashed rounded-md">
                            <Upload className="h-5 w-5 text-muted-foreground" />
                            <input type="file" accept=".txt,image/*" onChange={handleFileChange} ref={fileInputRef} className="max-w-sm text-sm"/>
                        </div>
                    </TabsContent>
                    <TabsContent value="ai" className="mt-4 space-y-4">
                        <Input 
                            placeholder="Enter a topic, e.g., 'Quantum Mechanics'"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                        />
                    </TabsContent>
                </Tabs>

                <div className="mt-4 flex items-center gap-4">
                    <div className="flex-grow">
                        <Label htmlFor="num-questions">Number of Questions</Label>
                        <Select value={numQuestions} onValueChange={setNumQuestions}>
                            <SelectTrigger id="num-questions" className="w-[120px]">
                                <SelectValue placeholder="Number of questions" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="15">15</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={handleGenerateQuiz} className="self-end" disabled={quizState === 'loading'}>
                        <BrainCircuit className="mr-2 h-4 w-4" />
                        Generate Quiz
                    </Button>
                </div>
            </CardContent>
        </Card>
    </motion.div>
  );
}

    