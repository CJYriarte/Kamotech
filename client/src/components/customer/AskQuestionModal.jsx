import React, { useState } from 'react';
import { X, MessageCircleQuestion } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';
import { useAuth } from '../../context/AuthContext';


export default function AskQuestionModal({ open, onClose }) {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setError('');

    const { error } = await supabase.from('inquiries').insert({
      customer_id: user.id,
      source: 'website',
      message: message.trim(),
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSent(true);
    setMessage('');
  };

  const handleClose = () => {
    setSent(false);
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-main/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-softLg">

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-navy-main">Ask a Question</h2>
          <button onClick={handleClose} className="text-ink-secondary hover:text-brand-red transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {sent ? (
          <div className="text-center py-6">
            <MessageCircleQuestion className="w-10 h-10 text-sky-primary mx-auto mb-3" />
            <h3 className="font-bold text-navy-main mb-1">Question sent!</h3>
            <p className="text-ink-secondary text-sm mb-4">
              Our team will get back to you soon. You can follow up through the same channel you used to reach us.
            </p>
            <button
              onClick={handleClose}
              className="w-full py-3 rounded-lg bg-brand-red hover:bg-brand-redDeep text-white font-semibold text-sm"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-ink-secondary text-sm">
              Have a question about a package, booking, or anything else? Send it to our team.
            </p>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your question…"
              rows={4}
              required
              className="w-full px-3 py-2 rounded-lg border border-cyan-pale text-sm focus:outline-none focus:ring-2 focus:ring-sky-primary"
            />

            {error && (
              <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-brand-red hover:bg-brand-redDeep text-white font-semibold text-sm disabled:opacity-60"
            >
              {loading ? 'Sending…' : 'Send Question'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}