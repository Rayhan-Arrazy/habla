"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Globe, Loader2, RefreshCw } from "lucide-react";
import { PronunciationChecker } from "@/components/PronunciationChecker";

interface ExploreWord {
  spanish: string;
  english: string;
  exampleSentenceEs: string;
  exampleSentenceEn: string;
}

export default function ExplorePage() {
  const [words, setWords] = useState<ExploreWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchWords = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const apiKey = localStorage.getItem("habla_api_key") || "";
      const level = localStorage.getItem("habla_level") || "A1";

      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "explore", apiKey, level }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setWords(Array.isArray(data) ? data : []);
      } else {
        if (data.error === "MISSING_API_KEY") {
          setErrorMsg("Please add your Gemini API Key on the dashboard to explore new words.");
        } else {
          setErrorMsg("Failed to generate words.");
        }
      }
    } catch (e) {
      console.error(e);
      setErrorMsg("Network error.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWords();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors flex flex-col">
      <header className="p-4 flex items-center justify-between max-w-5xl mx-auto w-full">
        <Link href="/" className="flex items-center text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-100 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-1" /> Back
        </Link>
        <div className="flex items-center gap-2 text-xl font-bold text-sky-600">
          <Globe className="w-6 h-6" />
          Explore Vocabulary
        </div>
        <button 
          onClick={fetchWords} 
          disabled={loading}
          className="p-2 rounded-full hover:bg-slate-200 dark:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center p-4">
        {loading && words.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1">
            <Loader2 className="w-12 h-12 mb-4 animate-spin text-sky-500" />
            <p className="text-slate-500 dark:text-slate-400">Generating new vocabulary...</p>
          </div>
        ) : errorMsg ? (
          <div className="flex flex-col items-center justify-center flex-1 text-center">
            <p className="text-es-red-500 font-bold mb-4">{errorMsg}</p>
            <Link href="/">
              <button className="bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-900">
                Go to Settings
              </button>
            </Link>
          </div>
        ) : (
          <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {words.map((word, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 transition-colors p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col hover:shadow-md transition-shadow">
                <div className="mb-4">
                  <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1 capitalize">{word.spanish}</h3>
                  <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">{word.english}</p>
                </div>
                
                <div className="bg-sky-50 p-4 rounded-xl text-left border border-sky-100 mb-4 flex-1">
                  <p className="font-medium text-slate-800 dark:text-slate-100 mb-1">{word.exampleSentenceEs}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 italic">{word.exampleSentenceEn}</p>
                </div>

                <div className="-mx-2 -mb-2">
                  <PronunciationChecker targetWord={word.spanish} />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
