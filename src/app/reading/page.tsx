"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Loader2, RefreshCw, CheckCircle2 } from "lucide-react";

export default function ReadingPage() {
  const [readingData, setReadingData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const fetchReading = async () => {
    setLoading(true);
    setReadingData(null);
    setSubmitted(false);
    setSelectedAnswers({});
    try {
      const level = localStorage.getItem("habla_level") || "A1";
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "reading", level }),
      });
      const data = await res.json();
      if (res.ok) setReadingData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (qIdx: number, oIdx: number) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: oIdx }));
  };

  const checkScore = () => {
    if (Object.keys(selectedAnswers).length < readingData?.questions?.length) {
      alert("Please answer all questions first!");
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="p-4 flex items-center justify-between max-w-5xl mx-auto w-full border-b border-slate-200">
        <Link href="/" className="flex items-center text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-1" /> Back to Hub
        </Link>
        <div className="flex items-center gap-2 text-xl font-bold text-es-red-600">
          <BookOpen className="w-6 h-6" />
          Reading Comprehension
        </div>
        <button onClick={fetchReading} disabled={loading} className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors disabled:opacity-50">
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center p-4">
        {!readingData && !loading ? (
          <div className="flex flex-col items-center justify-center flex-1 mt-20">
            <BookOpen className="w-16 h-16 text-slate-300 mb-6" />
            <h2 className="text-2xl font-bold text-slate-700 mb-4">Generate a Reading Test</h2>
            <p className="text-slate-500 mb-8 max-w-md text-center">Practice your reading comprehension with a short story tailored to your Spanish level, followed by questions.</p>
            <button onClick={fetchReading} className="bg-es-red-600 text-white px-8 py-3 rounded-full font-bold hover:bg-es-red-700 shadow-lg">
              Generate Story
            </button>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center flex-1 mt-20">
            <Loader2 className="w-12 h-12 mb-4 animate-spin text-es-red-500" />
            <p className="text-slate-500">Writing a unique story...</p>
          </div>
        ) : readingData && (
          <div className="w-full max-w-3xl mt-8 pb-20 animate-in fade-in duration-500">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 mb-8">
              <h1 className="text-3xl font-extrabold text-slate-900 mb-6">{readingData.title}</h1>
              <div className="prose prose-lg prose-slate max-w-none">
                {readingData.story.split('\n').map((paragraph: string, idx: number) => (
                  <p key={idx} className="mb-4 text-slate-700 leading-relaxed">{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Comprehension Questions</h2>
              {readingData.questions.map((q: any, qIdx: number) => (
                <div key={qIdx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">{qIdx + 1}. {q.question}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {q.options.map((opt: string, oIdx: number) => {
                      const isSelected = selectedAnswers[qIdx] === oIdx;
                      const isCorrect = oIdx === q.correctAnswer;
                      
                      let btnClass = "border-2 text-left px-4 py-3 rounded-xl font-medium transition-all ";
                      if (!submitted) {
                        btnClass += isSelected ? "border-es-red-500 bg-es-red-50 text-es-red-700" : "border-slate-200 hover:border-slate-300 text-slate-600";
                      } else {
                        if (isCorrect) btnClass += "border-green-500 bg-green-50 text-green-700";
                        else if (isSelected && !isCorrect) btnClass += "border-red-500 bg-red-50 text-red-700 opacity-50";
                        else btnClass += "border-slate-200 text-slate-400 opacity-50";
                      }

                      return (
                        <button key={oIdx} onClick={() => handleSelect(qIdx, oIdx)} className={btnClass} disabled={submitted}>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  {submitted && (
                    <div className="mt-4 p-4 bg-slate-50 rounded-xl text-sm text-slate-600 border border-slate-100 flex gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                      {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {!submitted && readingData && (
              <div className="mt-8 flex justify-center">
                <button onClick={checkScore} className="bg-slate-800 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-slate-900 transition-all shadow-lg">
                  Submit Answers
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
