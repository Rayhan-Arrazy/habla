"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, MessageCircle, Send, Loader2, Sparkles } from "lucide-react";

export default function ConversationPage() {
  const [messages, setMessages] = useState<{role: string, content: string, translation?: string}[]>([
    { role: "assistant", content: "¡Hola! ¿Cómo estás hoy? Vamos a practicar tu español.", translation: "Hello! How are you today? Let's practice your Spanish." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const level = localStorage.getItem("habla_level") || "A1";
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "conversation", text: userMsg, level })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.reply || "Error", translation: data.translation }]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-es-yellow-200/40 rounded-full blur-[120px] pointer-events-none" />

      <header className="p-4 flex items-center max-w-5xl mx-auto w-full relative z-10 border-b border-slate-200 bg-white/50 backdrop-blur-md">
        <Link href="/" className="flex items-center text-slate-500 hover:text-slate-800 transition-colors mr-auto font-medium">
          <ArrowLeft className="w-5 h-5 mr-1" /> Back
        </Link>
        <div className="flex items-center gap-2 text-xl font-black text-es-yellow-600">
          <MessageCircle className="w-6 h-6" />
          AI Conversation Roleplay
        </div>
      </header>

      <main className="flex-1 w-full max-w-3xl mx-auto p-4 flex flex-col relative z-10 h-[calc(100vh-80px)]">
        <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col overflow-hidden mb-4">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-es-yellow-500 text-white rounded-tr-none' 
                    : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed font-medium">{msg.content}</p>
                  {msg.translation && (
                    <div className="mt-2 pt-2 border-t border-slate-200/30 text-sm opacity-80 flex items-start gap-1">
                      <Sparkles className="w-4 h-4 shrink-0" />
                      <span>{msg.translation}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 rounded-2xl p-4 rounded-tl-none border border-slate-200 flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-es-yellow-500" />
                  <span className="text-slate-500 font-medium">Typing...</span>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Reply in Spanish..."
              className="flex-1 bg-white border border-slate-300 rounded-full px-6 py-4 focus:outline-none focus:border-es-yellow-500 focus:ring-1 focus:ring-es-yellow-500 shadow-inner"
            />
            <button 
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="bg-es-yellow-500 text-white w-14 h-14 rounded-full flex items-center justify-center hover:bg-es-yellow-600 transition-colors disabled:opacity-50 shadow-md"
            >
              <Send className="w-6 h-6" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
