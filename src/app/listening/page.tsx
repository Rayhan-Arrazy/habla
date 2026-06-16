"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Headphones, Loader2, Play, RefreshCw, CheckCircle2, XCircle, Volume2 } from "lucide-react";

export default function ListeningPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const fetchAudio = async () => {
    setLoading(true);
    setData(null);
    setInput("");
    setSubmitted(false);
    setIsCorrect(false);
    try {
      const level = localStorage.getItem("habla_level") || "A1";
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "listening", level }),
      });
      const result = await res.json();
      if (res.ok) setData(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const playAudio = (rate = 0.9) => {
    if (!data?.spanish || typeof window === 'undefined') return;
    setIsPlaying(true);
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(data.spanish);
    utterance.lang = "es-ES";
    utterance.rate = rate; // slightly slower for learners
    
    // Find a good Spanish voice
    const voices = synth.getVoices();
    const esVoice = voices.find(v => v.lang.startsWith('es-ES') || v.lang.startsWith('es-MX'));
    if (esVoice) utterance.voice = esVoice;
    
    utterance.onend = () => setIsPlaying(false);
    synth.speak(utterance);
  };

  const checkAnswer = () => {
    if (!input) return;
    const cleanStr = (s: string) => s.toLowerCase().replace(/[.,!¡?¿]/g, "").trim();
    const correct = cleanStr(input) === cleanStr(data.spanish);
    setIsCorrect(correct);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      {/* Background Decorators */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-es-yellow-200/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-es-red-200/40 rounded-full blur-[120px] pointer-events-none" />

      <header className="p-4 flex items-center justify-between max-w-5xl mx-auto w-full relative z-10">
        <Link href="/" className="flex items-center text-slate-500 hover:text-slate-800 transition-colors font-medium">
          <ArrowLeft className="w-5 h-5 mr-1" /> Back
        </Link>
        <div className="flex items-center gap-2 text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-es-red-600 to-es-yellow-600">
          <Headphones className="w-6 h-6 text-es-red-500" />
          Listening Test
        </div>
        <button onClick={fetchAudio} disabled={loading} className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors disabled:opacity-50">
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 relative z-10 w-full">
        {!data && !loading ? (
          <div className="flex flex-col items-center max-w-md text-center animate-in zoom-in-95 duration-500">
            <div className="w-32 h-32 bg-gradient-to-br from-es-red-100 to-es-yellow-100 rounded-full flex items-center justify-center mb-8 shadow-inner border border-white">
              <Headphones className="w-16 h-16 text-es-red-500" />
            </div>
            <h2 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">Audio Dictation</h2>
            <p className="text-lg text-slate-500 mb-10 font-medium">Listen to the AI native speaker and type exactly what you hear to test your ear training.</p>
            <button onClick={fetchAudio} className="bg-gradient-to-r from-es-red-600 to-es-yellow-500 text-white px-10 py-5 rounded-full font-bold text-xl hover:scale-105 hover:shadow-xl transition-all w-full md:w-auto">
              Start Test
            </button>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center animate-pulse">
            <Loader2 className="w-16 h-16 mb-6 animate-spin text-es-yellow-500" />
            <p className="text-xl font-bold text-slate-500">Generating audio...</p>
          </div>
        ) : data && (
          <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* Audio Player Card */}
            <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center mb-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-es-red-500 to-es-yellow-400" />
              
              <button 
                onClick={() => playAudio(0.9)}
                disabled={isPlaying}
                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                  isPlaying ? 'bg-es-yellow-100 scale-110 shadow-inner' : 'bg-gradient-to-br from-es-red-500 to-es-yellow-500 hover:scale-105 shadow-lg shadow-es-red-500/30'
                }`}
              >
                {isPlaying ? <Volume2 className="w-10 h-10 text-es-red-600 animate-pulse" /> : <Play className="w-10 h-10 text-white ml-2" />}
              </button>
              
              <div className="mt-8 flex gap-4">
                <button onClick={() => playAudio(0.6)} className="px-6 py-2 rounded-full border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors text-sm flex items-center gap-2">
                  <Play className="w-4 h-4" /> Slower (0.6x)
                </button>
                <button onClick={() => playAudio(0.9)} className="px-6 py-2 rounded-full border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors text-sm flex items-center gap-2">
                  <Play className="w-4 h-4" /> Normal
                </button>
              </div>
            </div>

            {/* Input Section */}
            <div className="mb-6 relative">
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={submitted}
                placeholder="Type the Spanish sentence here..."
                className={`w-full h-32 p-6 rounded-3xl border-2 text-xl font-medium focus:outline-none resize-none transition-colors shadow-sm ${
                  submitted 
                    ? isCorrect 
                      ? "border-green-400 bg-green-50 text-green-900" 
                      : "border-red-400 bg-red-50 text-red-900"
                    : "border-slate-200 focus:border-es-yellow-400 bg-white"
                }`}
              />
              {submitted && (
                <div className="absolute top-4 right-4">
                  {isCorrect ? <CheckCircle2 className="w-8 h-8 text-green-500" /> : <XCircle className="w-8 h-8 text-red-500" />}
                </div>
              )}
            </div>

            {!submitted ? (
              <button 
                onClick={checkAnswer}
                disabled={!input}
                className="w-full bg-slate-800 text-white py-5 rounded-2xl font-bold text-xl hover:bg-slate-900 transition-colors shadow-lg disabled:opacity-50 disabled:hover:bg-slate-800"
              >
                Check Answer
              </button>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
                <div className={`p-6 rounded-3xl border-2 ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                  <h3 className={`text-sm font-black uppercase mb-2 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    {isCorrect ? "Perfectly Correct!" : "Correct Answer"}
                  </h3>
                  <p className="text-xl font-bold text-slate-800 mb-1">{data.spanish}</p>
                  <p className="text-slate-500 font-medium">{data.english}</p>
                </div>
                
                <div className="p-6 rounded-3xl bg-es-yellow-50 border border-es-yellow-200">
                  <h3 className="text-sm font-black uppercase text-es-yellow-600 mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Pronunciation Tip
                  </h3>
                  <p className="text-slate-700 font-medium leading-relaxed">{data.tips}</p>
                </div>

                <button 
                  onClick={fetchAudio}
                  className="w-full bg-gradient-to-r from-es-red-600 to-es-yellow-500 text-white py-5 rounded-2xl font-bold text-xl hover:opacity-90 transition-opacity shadow-lg"
                >
                  Next Audio Challenge
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
