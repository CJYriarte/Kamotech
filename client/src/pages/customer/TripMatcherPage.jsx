import React, { useState } from 'react';
import { Sparkles, Send, MapPin } from 'lucide-react';
import bgTripMatcher from '../../assets/branding/bg-trip-matcher.png';


const EXAMPLE_PROMPTS = [
  'Beach vacation for 5 days',
  'Family trip to Japan in December',
  'Budget trip under ₱20k',
  'Romantic getaway for couples',
  'Adventure in the mountains',
  'City tour in Europe',
];


export default function TripMatcherPage() {
  const [prompt, setPrompt] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-cover bg-center relative" style={{ backgroundImage: `url(${bgTripMatcher})` }}>
      <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/85 to-cloud-50" />

      <section className="relative z-10 max-w-3xl mx-auto px-4 pt-20 pb-16 text-center">

        <div className="inline-flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-wider mb-4">
          <Sparkles className="w-4 h-4" />
          AI-Powered
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-navy-main mb-4">
          Find My Perfect Trip
        </h1>

        <p className="text-ink-secondary max-w-xl mx-auto mb-10">
          Describe your dream trip and let our AI help you find the perfect match from our packages.
        </p>

        <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto mb-6">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your dream trip..."
            className="w-full pl-6 pr-14 py-4 rounded-full bg-white border border-cyan-pale text-navy-main placeholder-ink-muted focus:outline-none focus:ring-2 focus:ring-sky-primary shadow-soft text-sm"
          />

          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-sky-primary hover:bg-sky-deep text-white transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="flex flex-wrap justify-center gap-2 max-w-xl mx-auto">
          {EXAMPLE_PROMPTS.map((example) => (
            <button
              key={example}
              onClick={() => setPrompt(example)}
              className="px-4 py-2 rounded-full bg-white border border-cyan-pale text-xs text-ink-secondary hover:border-sky-primary hover:text-navy-main transition-colors shadow-soft"
            >
              {example}
            </button>
          ))}
        </div>

      </section>

      {submitted && (
        <section className="max-w-2xl mx-auto px-4 pb-20">
          <div className="bg-white border border-cyan-pale rounded-2xl p-8 text-center shadow-soft">
            <MapPin className="w-8 h-8 text-sky-primary mx-auto mb-3" />

            <h2 className="text-lg font-bold text-navy-main mb-2">AI matching coming soon</h2>

            <p className="text-ink-secondary text-sm">
              You searched: <span className="text-navy-main font-medium">"{prompt}"</span>
            </p>

            <p className="text-ink-muted text-xs mt-3">
              The matching engine isn't wired up yet — this page is the interface only for now.
            </p>
          </div>
        </section>
      )}

    </div>
  );
}