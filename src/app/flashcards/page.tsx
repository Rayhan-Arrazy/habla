"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Brain, ChevronRight, CheckCircle2, RotateCcw } from "lucide-react";
import { getDueFlashcards, updateFlashcardProgress } from "../actions";

export default function FlashcardsPage() {
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    getDueFlashcards().then(data => {
      setCards(data);
      setLoading(false);
    });
  }, []);

  const handleNext = async (ease: number) => {
    setIsFlipped(false);
    
    // Save progression
    await updateFlashcardProgress(cards[currentIndex].id, ease);

    setTimeout(() => {
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(c => c + 1);
      } else {
        setFinished(true);
      }
    }, 150);
  };

  const restart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setFinished(false);
  };

  if (finished) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-200 text-center animate-in zoom-in-95">
          <CheckCircle2 className="w-20 h-20 text-es-yellow-500 mx-auto mb-6" />
          <h1 className="text-3xl font-black text-slate-800 mb-2">Deck Completed!</h1>
          <p className="text-slate-500 mb-8 font-medium">You reviewed all {cards.length} flashcards today. Great job!</p>
          <div className="flex gap-4 justify-center">
            <button onClick={restart} className="bg-slate-100 text-slate-600 px-6 py-3 rounded-full font-bold hover:bg-slate-200 transition-colors flex items-center gap-2">
              <RotateCcw className="w-5 h-5" /> Review Again
            </button>
            <Link href="/">
              <button className="bg-gradient-to-r from-es-red-600 to-es-yellow-500 text-white px-8 py-3 rounded-full font-bold hover:opacity-90 shadow-lg">
                Back to Hub
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-es-red-600"></div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-200 text-center">
          <Brain className="w-20 h-20 text-slate-300 mx-auto mb-6" />
          <h1 className="text-3xl font-black text-slate-800 mb-2">No Due Flashcards!</h1>
          <p className="text-slate-500 mb-8 font-medium">You are all caught up for today.</p>
          <Link href="/">
            <button className="bg-gradient-to-r from-es-red-600 to-es-yellow-500 text-white px-8 py-3 rounded-full font-bold hover:opacity-90 shadow-lg">
              Back to Hub
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const card = cards[currentIndex];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-es-red-200/40 rounded-full blur-[120px] pointer-events-none" />

      <header className="p-4 flex items-center max-w-5xl mx-auto w-full border-b border-slate-200 relative z-10">
        <Link href="/" className="flex items-center text-slate-500 hover:text-slate-800 transition-colors mr-auto font-medium">
          <ArrowLeft className="w-5 h-5 mr-1" /> Back
        </Link>
        <div className="flex items-center gap-2 text-xl font-black text-es-red-600">
          <Brain className="w-6 h-6" />
          Flashcards Practice
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-xl">
          <div className="mb-6 flex justify-between items-center text-slate-500 font-bold">
            <span>Card {currentIndex + 1} of {cards.length}</span>
            <span className="bg-white px-3 py-1 rounded-full shadow-sm border border-slate-200 text-es-yellow-600">
              Daily Review
            </span>
          </div>

          <div 
            className="relative w-full h-[400px] perspective-1000 cursor-pointer group"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className={`w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
              
              {/* Front */}
              <div className="absolute inset-0 backface-hidden bg-white rounded-[2rem] shadow-xl border border-slate-200 flex flex-col items-center justify-center p-8 group-hover:border-es-red-200 transition-colors">
                <span className="absolute top-4 right-6 text-slate-300 font-bold tracking-widest uppercase text-xs">Spanish</span>
                <h2 className="text-5xl font-black text-slate-800 mb-4 capitalize text-center">{card.spanish}</h2>
                <p className="text-slate-400 font-medium">Tap to reveal translation</p>
              </div>

              {/* Back */}
              <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-es-red-600 to-es-yellow-500 rounded-[2rem] shadow-xl border-2 border-transparent flex flex-col items-center justify-center p-8 text-center rotate-y-180 text-white">
                <span className="absolute top-4 right-6 text-es-yellow-200 font-bold tracking-widest uppercase text-xs">English</span>
                <h2 className="text-4xl font-black mb-6 drop-shadow-sm">{card.english}</h2>
                <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm w-full">
                  <p className="text-lg font-medium">"{card.example_sentence_es || card.exampleSentenceEs}"</p>
                </div>
              </div>

            </div>

            {/* Controls */}
            {isFlipped && (
              <div className="absolute -bottom-24 left-0 w-full flex justify-center gap-4 animate-in slide-in-from-top-4 fade-in">
                <button onClick={(e) => { e.stopPropagation(); handleNext(1); }} className="px-6 py-3 rounded-xl font-bold bg-white text-slate-700 hover:bg-slate-100 shadow-md transition-colors border border-slate-200">Hard</button>
                <button onClick={(e) => { e.stopPropagation(); handleNext(2); }} className="px-6 py-3 rounded-xl font-bold bg-white text-es-yellow-600 hover:bg-es-yellow-50 shadow-md transition-colors border border-es-yellow-200">Good</button>
                <button onClick={(e) => { e.stopPropagation(); handleNext(3); }} className="px-6 py-3 rounded-xl font-bold bg-es-red-600 text-white hover:bg-es-red-700 shadow-md transition-colors">Easy</button>
              </div>
            )}
          </div>
        </div>
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
