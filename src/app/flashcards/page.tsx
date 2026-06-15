"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, Brain } from "lucide-react";

// Mock data until DB is connected
const MOCK_FLASHCARDS = [
  { id: 1, spanish: "Desarrollo", english: "Development", example: "El desarrollo de software es divertido." },
  { id: 2, spanish: "Desafío", english: "Challenge", example: "Este es un gran desafío." },
  { id: 3, spanish: "Éxito", english: "Success", example: "El éxito requiere trabajo duro." }
];

export default function FlashcardsPage() {
  const [cards] = useState(MOCK_FLASHCARDS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const handleNext = (ease: number) => {
    // ease: 1=hard, 2=good, 3=easy (used for spaced repetition calculation in real app)
    setIsFlipped(false);
    setTimeout(() => {
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(c => c + 1);
      } else {
        setIsFinished(true);
      }
    }, 150);
  };

  const currentCard = cards[currentIndex];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="p-4 flex items-center justify-between max-w-3xl mx-auto w-full">
        <Link href="/" className="flex items-center text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-1" /> Back
        </Link>
        <div className="flex items-center gap-2 text-xl font-bold text-slate-800">
          <Brain className="w-6 h-6 text-es-red-500" />
          Flashcards Review
        </div>
        <div className="text-sm font-medium text-slate-400">
          {currentIndex + 1} / {cards.length}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        {isFinished ? (
          <div className="text-center animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <RefreshCw className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold mb-2">You're all caught up!</h2>
            <p className="text-slate-500 mb-8">Great job completing your reviews for today.</p>
            <Link href="/">
              <button className="bg-es-red-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-es-red-700 transition-colors">
                Back Home
              </button>
            </Link>
          </div>
        ) : (
          <div className="max-w-md w-full relative h-[400px] perspective-1000">
            <div 
              className={`w-full h-full relative transition-transform duration-500 transform-style-3d cursor-pointer ${
                isFlipped ? "rotate-y-180" : ""
              }`}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              {/* Front of card */}
              <div className="absolute w-full h-full bg-white rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center justify-center p-8 backface-hidden">
                <span className="absolute top-4 right-6 text-slate-300 font-bold tracking-widest uppercase text-xs">Spanish</span>
                <h2 className="text-5xl font-extrabold text-slate-800">{currentCard.spanish}</h2>
                <p className="text-slate-400 mt-8 text-sm">Tap to flip</p>
              </div>

              {/* Back of card */}
              <div className="absolute w-full h-full bg-es-red-600 rounded-3xl shadow-xl border border-es-red-500 flex flex-col items-center justify-center p-8 backface-hidden rotate-y-180 text-white">
                <span className="absolute top-4 right-6 text-es-red-300 font-bold tracking-widest uppercase text-xs">English</span>
                <h2 className="text-4xl font-bold mb-6">{currentCard.english}</h2>
                <div className="bg-es-red-700/50 p-4 rounded-xl w-full text-center">
                  <p className="text-es-red-100 italic">"{currentCard.example}"</p>
                </div>
              </div>
            </div>

            {/* Controls */}
            {isFlipped && (
              <div className="absolute -bottom-24 left-0 w-full flex justify-center gap-4 animate-in slide-in-from-top-4 fade-in">
                <button onClick={(e) => { e.stopPropagation(); handleNext(1); }} className="px-6 py-3 rounded-xl font-bold bg-red-100 text-red-600 hover:bg-red-200 transition-colors">Hard</button>
                <button onClick={(e) => { e.stopPropagation(); handleNext(2); }} className="px-6 py-3 rounded-xl font-bold bg-amber-100 text-amber-600 hover:bg-amber-200 transition-colors">Good</button>
                <button onClick={(e) => { e.stopPropagation(); handleNext(3); }} className="px-6 py-3 rounded-xl font-bold bg-green-100 text-green-600 hover:bg-green-200 transition-colors">Easy</button>
              </div>
            )}
          </div>
        )}
      </main>
      <style dangerouslySetInnerHTML={{__html: `
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}} />
    </div>
  );
}
