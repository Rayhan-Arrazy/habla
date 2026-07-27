"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, BookA, Search, Filter, Loader2, Sparkles } from "lucide-react";
import { getDictionaryWords, addDictionaryWord } from "../actions";

export default function DictionaryPage() {
  const [search, setSearch] = useState("");
  const [words, setWords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchingAI, setSearchingAI] = useState(false);

  useEffect(() => {
    getDictionaryWords().then(data => {
      setWords(data);
      setLoading(false);
    });
  }, []);

  const filteredWords = words.filter(w => 
    w.spanish.toLowerCase().includes(search.toLowerCase()) || 
    w.english.toLowerCase().includes(search.toLowerCase())
  );

  const handleAISearch = async () => {
    if (!search.trim()) return;
    setSearchingAI(true);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "dictionary", text: search })
      });
      const data = await res.json();
      
      if (data && data.spanish && data.english) {
        // Save to DB permanently
        const newWord = await addDictionaryWord({
          spanish: data.spanish,
          english: data.english,
          exampleSentenceEs: data.exampleSentenceEs,
          exampleSentenceEn: data.exampleSentenceEn,
          synonyms: data.synonyms
        });
        
        // Add to local state
        setWords(prev => [newWord, ...prev]);
        setSearch(newWord.spanish); // Focus on the new word
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSearchingAI(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col relative overflow-hidden transition-colors">
      <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] bg-es-yellow-200/40 dark:bg-es-yellow-900/20 rounded-full blur-[120px] pointer-events-none" />

      <header className="p-4 flex items-center justify-between max-w-5xl mx-auto w-full relative z-10">
        <Link href="/" className="flex items-center text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors font-medium">
          <ArrowLeft className="w-5 h-5 mr-1" /> Back
        </Link>
        <div className="flex items-center gap-2 text-xl font-black text-es-red-600 dark:text-es-red-500">
          <BookA className="w-6 h-6" />
          Dictionary
        </div>
        <div className="w-20" /> {/* Spacer */}
      </header>

      <main className="flex-1 flex flex-col items-center p-4 relative z-10 w-full max-w-5xl mx-auto">
        <div className="w-full bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 mb-8 mt-4 flex items-center gap-4 transition-colors">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search Spanish or English words..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && filteredWords.length === 0) handleAISearch(); }}
              className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:border-es-yellow-400 dark:focus:border-es-yellow-500 dark:text-white transition-all outline-none text-lg font-medium"
            />
          </div>
          <button className="p-4 bg-slate-100 dark:bg-slate-700 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-slate-600 dark:text-slate-300">
            <Filter className="w-6 h-6" />
          </button>
        </div>

        {loading ? (
          <div className="w-full flex justify-center py-20">
            <Loader2 className="animate-spin h-12 w-12 text-es-red-600" />
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWords.map((item, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:border-es-red-200 dark:hover:border-es-red-500/50 hover:shadow-md transition-all group">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 group-hover:text-es-red-600 dark:group-hover:text-es-red-400 transition-colors">{item.spanish}</h3>
                  <span className="px-2 py-1 rounded text-xs font-bold bg-es-red-100 dark:bg-es-red-900/50 text-es-red-700 dark:text-es-red-400">
                    A1
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Word</p>
                <p className="text-lg font-medium text-slate-600 dark:text-slate-300">{item.english}</p>
                
                {item.synonyms && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="text-xs font-bold text-slate-400">Synonyms:</span>
                    {item.synonyms.split(',').map((syn: string, i: number) => (
                      <span key={i} className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-md">{syn.trim()}</span>
                    ))}
                  </div>
                )}
                
                {item.exampleSentenceEs && (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium italic">"{item.exampleSentenceEs}"</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{item.exampleSentenceEn}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {!loading && filteredWords.length === 0 && (
          <div className="text-center py-20 flex flex-col items-center">
            <p className="text-slate-500 dark:text-slate-400 font-medium text-xl mb-6">
              "{search}" is not in the dictionary yet.
            </p>
            <button 
              onClick={handleAISearch} 
              disabled={searchingAI}
              className="bg-gradient-to-r from-es-red-600 to-es-yellow-500 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100 shadow-md"
            >
              {searchingAI ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              {searchingAI ? "Generating Definition..." : "Ask AI to Define & Save"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
