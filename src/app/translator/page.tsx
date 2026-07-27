"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Languages, ArrowRightLeft, Loader2, Sparkles } from "lucide-react";

export default function TranslatorPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);

  const translate = async () => {
    if (!input) return;
    setLoading(true);
    try {
      const level = localStorage.getItem("habla_level") || "A1";
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "translate", text: input, level }),
      });
      const data = await res.json();
      if (res.ok) {
        setOutput(data.translation || "Translation failed.");
        setExplanation(data.explanation || "");
      } else {
        setOutput(data.error || "Error occurred.");
      }
    } catch (e) {
      setOutput("Network Error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors flex flex-col">
      <header className="p-4 flex items-center max-w-5xl mx-auto w-full border-b border-slate-200 dark:border-slate-800">
        <Link href="/" className="flex items-center text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-100 transition-colors mr-auto">
          <ArrowLeft className="w-5 h-5 mr-1" /> Back to Hub
        </Link>
        <div className="flex items-center gap-2 text-xl font-bold text-es-yellow-600">
          <Languages className="w-6 h-6" />
          AI Translator
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center p-4">
        <div className="w-full max-w-4xl mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text in English or Spanish..."
              className="w-full h-48 p-6 rounded-3xl border-2 border-slate-200 dark:border-slate-800 focus:border-es-red-400 focus:outline-none resize-none text-lg"
            />
            <div className="w-full h-48 p-6 rounded-3xl bg-slate-100 dark:bg-slate-800 transition-colors border-2 border-slate-200 dark:border-slate-800 text-lg flex flex-col relative overflow-hidden">
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800 transition-colors/80">
                  <Loader2 className="w-8 h-8 animate-spin text-es-yellow-500" />
                </div>
              ) : null}
              <p className="flex-1 overflow-y-auto font-medium text-slate-800 dark:text-slate-100">
                {output || "Translation will appear here..."}
              </p>
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button 
              onClick={translate}
              disabled={loading || !input}
              className="bg-es-red-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-es-red-700 transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-5 h-5" /> Translate Now
            </button>
          </div>

          {explanation && (
            <div className="mt-8 bg-white dark:bg-slate-900 transition-colors p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-4">
              <h3 className="text-sm font-bold uppercase text-es-yellow-600 mb-2">AI Explanation & Grammar Tip</h3>
              <p className="text-slate-700 dark:text-slate-300">{explanation}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
