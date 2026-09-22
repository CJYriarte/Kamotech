import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bot, Send, MapPin, FileText, Shield, CreditCard, Compass, ArrowLeft } from 'lucide-react';


const QUICK_TOPICS = [
  { label: 'Popular Destinations', icon: MapPin },
  { label: 'Visa Requirements', icon: FileText },
  { label: 'Travel Insurance', icon: Shield },
  { label: 'Payment Options', icon: CreditCard },
  { label: 'Custom Tour', icon: Compass },
];

const STARTER_PROMPTS = [
  'I want a beach vacation in 5 days under ₱20k',
  'What documents do I need for Japan?',
  'How do installment payments work?',
];


export default function SkyBotPage() {
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Hi! I'm SkyBot 👋 I can help you plan your next adventure. What are you looking for today?" },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = (text) => {
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { from: 'user', text }]);
    setInput('');
    setTyping(true);

    // >>> TEAMMATES: this is the exact spot to replace with a real
    // >>> Gemini API call. Send `text` (and ideally the running
    // >>> `messages` history for context), await the model's reply,
    // >>> then push { from: 'bot', text: <reply> } the same way this does.
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        { from: 'bot', text: "I'm not connected to real AI yet — my teammates are still wiring that part up. For now, try browsing Explore or Find My Trip!" },
      ]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-cloud-50 flex">

      <aside className="hidden md:flex w-64 bg-navy-main flex-col p-4">

        <Link to="/" className="flex items-center gap-2 text-cyan-light hover:text-white text-sm mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Explore
        </Link>

        <div className="flex items-center gap-2 mb-1">
          <div className="bg-sky-primary p-2 rounded-lg text-white">
            <Bot className="w-5 h-5" />
          </div>
          <span className="font-bold text-white">SkyBot</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-cyan-light mb-8 ml-1">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-light" />
          Online
        </div>

        <p className="text-xs font-semibold text-cyan-light/70 uppercase tracking-wider mb-3">Quick Topics</p>

        <div className="space-y-1">
          {QUICK_TOPICS.map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => sendMessage(label)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-cyan-pale hover:bg-navy-deep hover:text-white text-left transition-colors"
            >
              <Icon className="w-4 h-4 text-cyan-light" />
              {label}
            </button>
          ))}
        </div>

      </aside>

      <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full">

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-8 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm ${
                  msg.from === 'user'
                    ? 'bg-sky-primary text-white rounded-br-sm'
                    : 'bg-white border border-cyan-pale text-navy-main rounded-bl-sm shadow-soft'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex justify-start">
              <div className="bg-white border border-cyan-pale px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 shadow-soft">
                <span className="w-1.5 h-1.5 rounded-full bg-ink-muted animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-ink-muted animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-ink-muted animate-bounce" />
              </div>
            </div>
          )}

          {messages.length === 1 && (
            <div className="pt-4 space-y-2">
              <p className="text-xs text-ink-muted text-center">Try asking:</p>
              {STARTER_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => sendMessage(p)}
                  className="block w-full text-left px-4 py-2.5 rounded-xl bg-white border border-cyan-pale text-sm text-ink-secondary hover:border-sky-primary hover:text-navy-main transition-colors shadow-soft"
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
          className="p-4 border-t border-cyan-pale bg-white"
        >
          <div className="relative">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message…"
              className="w-full pl-4 pr-12 py-3 rounded-full bg-cloud-50 border border-cyan-pale text-navy-main placeholder-ink-muted focus:outline-none focus:ring-2 focus:ring-sky-primary text-sm"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-sky-primary hover:bg-sky-deep text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}