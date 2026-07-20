"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, RefreshCw } from "lucide-react";

interface PronunciationCheckerProps {
  targetWord: string;
}

export function PronunciationChecker({ targetWord }: PronunciationCheckerProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState<"idle" | "correct" | "incorrect">("idle");
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = "es-ES";
      
      recognitionRef.current.onresult = (event: any) => {
        const current = event.resultIndex;
        const result = event.results[current][0].transcript;
        setTranscript(result);
        
        // Simple comparison, ignoring case and punctuation
        const normalize = (str: string) => str.toLowerCase().replace(/[.,!?;¿¡]/g, "").trim();
        
        if (normalize(result) === normalize(targetWord)) {
          setFeedback("correct");
        } else {
          setFeedback("incorrect");
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [targetWord]);

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setTranscript("");
      setFeedback("idle");
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const playAudio = () => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(targetWord);
      utterance.lang = "es-ES";
      
      // Try to find a native Spanish voice (preferring Google's or premium local voices)
      const voices = window.speechSynthesis.getVoices();
      const spanishVoices = voices.filter(v => v.lang.startsWith("es-"));
      
      if (spanishVoices.length > 0) {
        // Prefer Google or Premium voices
        const bestVoice = spanishVoices.find(v => v.name.includes("Google") || v.name.includes("Premium") || v.name.includes("Natural")) || spanishVoices[0];
        utterance.voice = bestVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mt-4">
      <h3 className="font-bold text-lg mb-4 text-slate-800 flex items-center gap-2">
        <Mic className="w-5 h-5 text-es-red-500" /> Practice Pronunciation
      </h3>
      
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={playAudio}
            className="p-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Listen to pronunciation"
          >
            <Volume2 className="w-6 h-6" />
          </button>
          
          <div className="text-3xl font-bold text-slate-900">{targetWord}</div>
        </div>

        <div className="relative">
          <button
            onClick={toggleListen}
            className={`p-6 rounded-full text-white transition-all shadow-lg ${
              isListening 
                ? "bg-red-500 hover:bg-red-600 animate-pulse shadow-red-500/30" 
                : "bg-es-red-600 hover:bg-es-red-700 shadow-es-red-500/30"
            }`}
          >
            {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
          </button>
          
          {/* Ripple effect when listening */}
          {isListening && (
            <div className="absolute inset-0 rounded-full border-4 border-red-500 animate-ping opacity-20"></div>
          )}
        </div>

        <div className="w-full text-center">
          {transcript && (
            <div className="mb-2">
              <span className="text-sm text-slate-500">You said:</span>
              <p className={`text-xl font-medium mt-1 ${
                feedback === "correct" ? "text-green-600" : "text-red-500"
              }`}>
                "{transcript}"
              </p>
            </div>
          )}
          
          {feedback === "correct" && (
            <div className="text-green-600 font-bold bg-green-50 px-4 py-2 rounded-lg inline-block">
              ¡Perfecto! 🌟
            </div>
          )}
          
          {feedback === "incorrect" && (
            <div className="text-red-500 bg-red-50 px-4 py-2 rounded-lg inline-block flex items-center justify-center gap-2 mx-auto">
              Not quite right. Try again! 
              <button onClick={toggleListen} className="hover:text-red-700 p-1">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
