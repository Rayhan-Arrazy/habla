"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Mic, Shuffle } from "lucide-react";
import { PronunciationChecker } from "@/components/PronunciationChecker";
import { getDictionaryWords } from "../actions";

export default function SpeakingPage() {
  const [words, setWords] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    getDictionaryWords().then(data => {
      // shuffle words
      const shuffled = [...data].sort(() => 0.5 - Math.random());
      setWords(shuffled);
    });
  }, []);

  const handleNext = () => {
    if (words.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }
  };

  const targetWord = words.length > 0 ? words[currentIndex].spanish : "Cargando...";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="p-4 flex items-center max-w-5xl mx-auto w-full border-b border-slate-200">
        <Link href="/" className="flex items-center text-slate-500 hover:text-slate-800 transition-colors mr-auto">
          <ArrowLeft className="w-5 h-5 mr-1" /> Back to Hub
        </Link>
        <div className="flex items-center gap-2 text-xl font-bold text-es-red-600">
          <Mic className="w-6 h-6" />
          Speaking Practice
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-lg relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-slate-800 mb-2">Pronunciation test</h1>
            <p className="text-slate-500 font-medium">Read the word out loud to test your accent.</p>
          </div>
          
          <PronunciationChecker targetWord={targetWord} />

          <div className="mt-8 flex justify-center">
            <button 
              onClick={handleNext}
              className="bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2"
            >
              <Shuffle className="w-5 h-5" /> Next Word
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
