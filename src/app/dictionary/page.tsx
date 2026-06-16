"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookA, Search, Filter } from "lucide-react";

const mockDictionary = [
  { word: "Hablar", type: "verb", english: "To speak", level: "A1" },
  { word: "Comida", type: "noun", english: "Food", level: "A1" },
  { word: "Desarrollo", type: "noun", english: "Development", level: "B2" },
  { word: "Cansado", type: "adjective", english: "Tired", level: "A1" },
  { word: "Almohada", type: "noun", english: "Pillow", level: "A2" },
  { word: "Sorprendente", type: "adjective", english: "Surprising", level: "B1" },
  { word: "Adivinar", type: "verb", english: "To guess", level: "B1" },
  { word: "Inolvidable", type: "adjective", english: "Unforgettable", level: "B2" },
  { word: "Madrugar", type: "verb", english: "To get up early", level: "B1" },
  { word: "Perezoso", type: "adjective", english: "Lazy", level: "A2" },
  { word: "Sobremesa", type: "noun", english: "Table talk after a meal", level: "C1" },
  { word: "Estrenar", type: "verb", english: "To wear/use for the first time", level: "B2" },
];

export default function DictionaryPage() {
  const [search, setSearch] = useState("");

  const filteredWords = mockDictionary.filter(w => 
    w.word.toLowerCase().includes(search.toLowerCase()) || 
    w.english.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] bg-es-yellow-200/40 rounded-full blur-[120px] pointer-events-none" />

      <header className="p-4 flex items-center justify-between max-w-5xl mx-auto w-full relative z-10">
        <Link href="/" className="flex items-center text-slate-500 hover:text-slate-800 transition-colors font-medium">
          <ArrowLeft className="w-5 h-5 mr-1" /> Back
        </Link>
        <div className="flex items-center gap-2 text-xl font-black text-es-red-600">
          <BookA className="w-6 h-6" />
          Dictionary
        </div>
        <div className="w-20" /> {/* Spacer */}
      </header>

      <main className="flex-1 flex flex-col items-center p-4 relative z-10 w-full max-w-5xl mx-auto">
        <div className="w-full bg-white p-6 rounded-3xl shadow-sm border border-slate-200 mb-8 mt-4 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search Spanish or English words..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-100 bg-slate-50 focus:border-es-yellow-400 focus:bg-white transition-all outline-none text-lg font-medium"
            />
          </div>
          <button className="p-4 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors text-slate-600">
            <Filter className="w-6 h-6" />
          </button>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWords.map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-es-red-200 hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-2xl font-bold text-slate-800 group-hover:text-es-red-600 transition-colors">{item.word}</h3>
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  item.level.startsWith('A') ? 'bg-green-100 text-green-700' :
                  item.level.startsWith('B') ? 'bg-es-yellow-100 text-es-yellow-700' :
                  'bg-es-red-100 text-es-red-700'
                }`}>
                  {item.level}
                </span>
              </div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">{item.type}</p>
              <p className="text-lg font-medium text-slate-600">{item.english}</p>
            </div>
          ))}
        </div>
        
        {filteredWords.length === 0 && (
          <div className="text-center py-20 text-slate-500 font-medium">
            No words found matching "{search}"
          </div>
        )}
      </main>
    </div>
  );
}
