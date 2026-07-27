"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle, Loader2, Trophy } from "lucide-react";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export default function QuizPage() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function fetchQuiz() {
      try {
        const apiKey = localStorage.getItem("habla_api_key") || "";
        const level = localStorage.getItem("habla_level") || "A1";

        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "quiz", apiKey, level }),
        });
        
        const data = await res.json();
        
        if (res.ok) {
          // Assuming AI returns an array of questions or an object with a "questions" key
          setQuestions(Array.isArray(data) ? data : data.questions || []);
        } else {
          if (data.error === "MISSING_API_KEY") {
            setErrorMsg("Please add your Gemini API Key on the dashboard to generate quizzes.");
          } else {
            setErrorMsg("Failed to generate quiz.");
          }
        }
      } catch (e) {
        console.error(e);
        setErrorMsg("Network error.");
      } finally {
        setLoading(false);
      }
    }
    fetchQuiz();
  }, []);

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    
    if (idx === questions[currentIdx].correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(c => c + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors flex items-center justify-center flex-col">
        <Loader2 className="w-12 h-12 mb-4 animate-spin text-es-red-500" />
        <p className="text-slate-500 dark:text-slate-400">Generating your quiz with AI...</p>
      </div>
    );
  }

  if (questions.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors flex flex-col items-center justify-center p-4 text-center">
        <p className="text-es-red-500 font-bold mb-4">{errorMsg || "Failed to load quiz. Please try again."}</p>
        {errorMsg && (
          <Link href="/">
            <button className="bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-900">
              Go to Settings
            </button>
          </Link>
        )}
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors flex flex-col items-center justify-center p-4 text-center">
        <Trophy className="w-24 h-24 text-amber-500 mb-6" />
        <h1 className="text-4xl font-bold mb-4">Quiz Complete!</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
          You scored <span className="font-bold text-es-red-600">{score}</span> out of {questions.length}.
        </p>
        <Link href="/">
          <button className="bg-es-red-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-es-red-700 transition-colors">
            Back to Dashboard
          </button>
        </Link>
      </div>
    );
  }

  const currentQ = questions[currentIdx];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors flex flex-col">
      <header className="p-4 flex items-center justify-between max-w-2xl mx-auto w-full">
        <Link href="/" className="flex items-center text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-100 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-1" /> Quit
        </Link>
        <div className="flex gap-2">
          {questions.map((_, i) => (
            <div 
              key={i} 
              className={`h-2 w-8 rounded-full ${
                i < currentIdx ? 'bg-es-red-600' : i === currentIdx ? 'bg-es-red-300' : 'bg-slate-200 dark:bg-slate-800 transition-colors'
              }`}
            />
          ))}
        </div>
        <div className="w-16"></div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-slate-800 dark:text-slate-100">
            {currentQ.question}
          </h2>

          <div className="grid grid-cols-1 gap-4 mb-8">
            {currentQ.options.map((option, idx) => {
              let btnClass = "bg-white dark:bg-slate-900 transition-colors border-2 border-slate-200 dark:border-slate-800 hover:border-es-red-300 text-slate-700 dark:text-slate-300";
              let icon = null;

              if (isAnswered) {
                if (idx === currentQ.correctAnswer) {
                  btnClass = "bg-green-50 border-green-500 text-green-700 font-bold";
                  icon = <CheckCircle2 className="w-6 h-6 text-green-500" />;
                } else if (idx === selectedOption) {
                  btnClass = "bg-red-50 border-red-500 text-red-700";
                  icon = <XCircle className="w-6 h-6 text-red-500" />;
                } else {
                  btnClass = "bg-slate-50 dark:bg-slate-950 transition-colors border-slate-200 dark:border-slate-800 text-slate-400 opacity-50";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={`w-full p-6 rounded-2xl text-lg transition-all flex items-center justify-between shadow-sm hover:shadow-md ${btnClass}`}
                  disabled={isAnswered}
                >
                  <span>{option}</span>
                  {icon}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div className="animate-in slide-in-from-bottom-4 fade-in">
              <div className="bg-blue-50 text-blue-900 p-6 rounded-2xl mb-6">
                <p className="font-medium">{currentQ.explanation}</p>
              </div>
              <button 
                onClick={handleNext}
                className="w-full bg-es-red-600 text-white p-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-es-red-700 transition-colors"
              >
                {currentIdx < questions.length - 1 ? "Next Question" : "See Results"}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
