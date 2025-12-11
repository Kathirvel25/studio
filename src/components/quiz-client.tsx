
"use client";

import { useState, useRef } from "react";
import { Loader2, Upload, BrainCircuit, Check, X, BookOpen, Lightbulb, Image as ImageIcon } from "lucide-react";
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

type QuizState = 'idle' | 'loading' | 'quiz' | 'result';
type Answer = { questionIndex: number; selectedOption: number };

const PASS_PERCENTAGE = 70;

export function QuizClient() {
  const [textContent, setTextContent] = useState("");
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const [quiz, setQuiz] = useState<GenerateMcqOutput | null>(null);
  const [quizState, setQuizState] = useState<QuizState>('idle');
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [score, setScore] = useState(0);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (!textContent && !imageDataUri) {
      toast({
        variant: "destructive",
        title: "No content",
        description: "Please paste text, an image, or upload a file to generate a quiz.",
      });
      return;
    }

    setQuizState('loading');
    setQuiz(null);
    setAnswers([]);
    setScore(0);

    try {
      const result = await generateMcq({ documentContent: textContent, imageDataUri });
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
    setAnswers([]);
    setScore(0);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };
  
  const getOptionLabelClassName = (isCorrect: boolean, isSelected: boolean, isSubmitted: boolean) => {
    if (!isSubmitted) return '';
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
      <Card>
        <CardHeader>
          <CardTitle>Quiz Time!</CardTitle>
          <CardDescription>Answer the questions below to test your knowledge.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {quiz.questions.map((q, qIndex) => (
            <div key={qIndex}>
              <p className="font-semibold mb-4">{qIndex + 1}. {q.question}</p>
              <RadioGroup onValueChange={(value) => handleAnswerChange(qIndex, parseInt(value))}>
                {q.options.map((option, oIndex) => (
                  <div key={oIndex} className="flex items-center space-x-2">
                    <RadioGroupItem value={oIndex.toString()} id={`q${qIndex}o${oIndex}`} />
                    <Label htmlFor={`q${qIndex}o${oIndex}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
          <Button onClick={handleSubmitQuiz} className="w-full">
            Submit Quiz
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (quizState === 'result') {
    const isPassed = score >= PASS_PERCENTAGE;
    return (
      <Card>
        <CardHeader className="text-center">
            <CardTitle className="text-3xl">Quiz Complete!</CardTitle>
            <CardDescription>You scored</CardDescription>
            <p className={`text-5xl font-bold ${isPassed ? 'text-green-600' : 'text-red-600'}`}>{Math.round(score)}%</p>
        </CardHeader>
        <CardContent className="space-y-8">
            <div className="flex items-center justify-center space-x-2">
                {isPassed ? <Check className="w-8 h-8 text-green-600" /> : <X className="w-8 h-8 text-red-600" />}
                <p className="text-lg font-medium">{isPassed ? "Congratulations, you passed!" : "You can do better. Keep studying!"}</p>
            </div>
            
            <div className="space-y-6">
                <h3 className="font-bold text-lg flex items-center"><BookOpen className="mr-2 h-5 w-5" />Review Your Answers</h3>
                {quiz?.questions.map((q, qIndex) => {
                    const userAnswer = answers.find(a => a.questionIndex === qIndex);
                    return (
                        <div key={qIndex} className="p-4 border rounded-md">
                            <p className="font-semibold mb-2">{qIndex + 1}. {q.question}</p>
                            <div className="space-y-1">
                                {q.options.map((option, oIndex) => (
                                    <div key={oIndex} className="flex items-center gap-2">
                                        {oIndex === q.correctAnswerIndex ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-red-600" />}
                                        <Label className={getOptionLabelClassName(oIndex === q.correctAnswerIndex, oIndex === userAnswer?.selectedOption, true)}>
                                            {option}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <Button onClick={handleTryAgain} className="w-full">
                <Lightbulb className="mr-2 h-4 w-4" />
                Create a New Quiz
            </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Your Quiz</CardTitle>
        <CardDescription>Paste your study notes or upload a file.</CardDescription>
      </CardHeader>
      <CardContent>
          <Tabs defaultValue="text">
              <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="text">Paste Content</TabsTrigger>
                  <TabsTrigger value="upload">Upload File</TabsTrigger>
              </TabsList>
              <TabsContent value="text" className="mt-4">
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
                  <div className="flex items-center space-x-2">
                      <Upload className="h-5 w-5 text-muted-foreground" />
                      <input type="file" accept=".txt,image/*" onChange={handleFilechange} ref={fileInputRef} className="max-w-sm text-sm"/>
                  </div>
              </TabsContent>
          </Tabs>
          <Button onClick={handleGenerateQuiz} disabled={!textContent && !imageDataUri} className="mt-4 w-full">
              <BrainCircuit className="mr-2 h-4 w-4" />
              Generate Quiz
          </Button>
      </CardContent>
    </Card>
  );
}
