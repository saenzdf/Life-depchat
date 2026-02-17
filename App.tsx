import React, { useState, useEffect, useRef } from 'react';
import { sendMessageToGemini, startChat } from './services/geminiService';
import { ChatMessage, QuotationJSON } from './types';
import QuotationCard from './components/QuotationCard';
import ProductCatalog from './components/ProductCatalog';

// Parsing function to extract JSON from markdown code blocks
const extractJSON = (text: string): { cleanText: string; jsonData: QuotationJSON | null } => {
  const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
  const match = text.match(jsonRegex);

  if (match && match[1]) {
    try {
      const jsonData = JSON.parse(match[1]);
      // Remove the JSON block from the text to avoid double display
      const cleanText = text.replace(jsonRegex, '').trim();
      return { cleanText, jsonData };
    } catch (e) {
      console.error("Failed to parse extracted JSON", e);
    }
  }
  return { cleanText: text, jsonData: null };
};

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCatalog, setShowCatalog] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Chat
  useEffect(() => {
    startChat();
    // Optional: Add an initial greeting from the "system" (simulated locally for speed)
    setMessages([
      {
        id: 'init',
        role: 'model',
        text: '¡Hola! Bienvenido a Life Deportes. Soy tu asesor virtual. ¿En qué puedo ayudarte hoy? Tenemos camisetas, uniformes y accesorios deportivos de la mejor calidad.',
        timestamp: new Date(),
      },
    ]);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await sendMessageToGemini(userMessage.text);
      
      const { cleanText, jsonData } = extractJSON(responseText);

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: cleanText,
        quotation: jsonData || undefined,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans overflow-hidden">
      {/* Mobile Catalog Toggle Overlay */}
      {showCatalog && (
        <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setShowCatalog(false)}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full max-w-4xl mx-auto w-full bg-white shadow-2xl relative">
        
        {/* Header */}
        <header className="flex justify-between items-center p-4 border-b border-slate-100 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              LD
            </div>
            <div>
              <h1 className="font-bold text-slate-800 text-lg leading-tight">Life Deportes</h1>
              <p className="text-xs text-green-500 font-medium flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                En línea
              </p>
            </div>
          </div>
          <button 
            onClick={() => setShowCatalog(!showCatalog)}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
          >
            {showCatalog ? 'Ocultar Catálogo' : 'Ver Catálogo'}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide bg-slate-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-5 py-3 shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed">
                  {msg.text}
                </div>
                
                {/* Render Quotation Card if JSON exists */}
                {msg.quotation && (
                  <QuotationCard data={msg.quotation} />
                )}
                
                <div className={`text-[10px] mt-1 text-right opacity-70 ${msg.role === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>
                    {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start w-full">
               <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none border border-slate-100 shadow-sm flex gap-2 items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100">
          <div className="flex gap-2 max-w-4xl mx-auto">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu mensaje aquí..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-slate-800 placeholder-slate-400"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center w-12 sm:w-auto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </button>
          </div>
          <div className="text-center mt-2">
            <p className="text-[10px] text-slate-400">
              Life Deportes AI puede cometer errores. Verifica los detalles importantes.
            </p>
          </div>
        </div>
      </div>

      {/* Side Catalog (Desktop: Drawer, Mobile: Modal-like) */}
      <div className={`fixed right-0 top-0 bottom-0 z-50 transform transition-transform duration-300 ease-in-out md:static md:z-0 md:transform-none ${showCatalog ? 'translate-x-0' : 'translate-x-full md:w-0 md:overflow-hidden'}`}>
        <ProductCatalog />
      </div>

    </div>
  );
};

export default App;
