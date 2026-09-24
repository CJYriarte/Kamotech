import React, { useEffect, useState } from 'react';
import { X, Send } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';
import { useAuth } from '../../context/AuthContext';


const STATUS_STYLES = {
  open: 'bg-amber-100 text-amber-700',
  in_progress: 'bg-sky-100 text-sky-700',
  resolved: 'bg-emerald-100 text-emerald-700',
};


export default function InquiryThreadModal({ inquiry, onClose }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (inquiry) fetchMessages();
  }, [inquiry]);

  if (!inquiry) return null;

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('inquiry_messages')
      .select('*, profiles(full_name)')
      .eq('inquiry_id', inquiry.id)
      .order('created_at', { ascending: true });

    if (error) setError(error.message);
    else setMessages(data || []);
  };

  const handleSend = async () => {
    if (!replyText.trim()) return;

    setSending(true);
    setError('');

    const { error } = await supabase.from('inquiry_messages').insert({
      inquiry_id: inquiry.id,
      sender_id: user.id,
      message: replyText.trim(),
    });

    setSending(false);

    if (error) {
      setError(error.message);
      return;
    }

    setReplyText('');
    fetchMessages();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-main/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] shadow-softLg flex flex-col overflow-hidden">

        <div className="p-5 border-b border-cyan-pale flex items-center justify-between">
          <div>
            <h2 className="font-bold text-navy-main">Your Question</h2>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_STYLES[inquiry.status]}`}>
              {inquiry.status.replace('_', ' ')}
            </span>
          </div>
          <button onClick={onClose} className="text-ink-secondary hover:text-brand-red transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3">

          <div className="flex justify-end">
            <div className="max-w-[80%] bg-sky-primary text-white px-4 py-3 rounded-2xl rounded-br-sm text-sm">
              <p>{inquiry.message}</p>
              <p className="text-[10px] text-white/70 mt-1">You • original question</p>
            </div>
          </div>

          {messages.map((msg) => {
            const isMe = msg.sender_id === user.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${
                    isMe
                      ? 'bg-sky-primary text-white rounded-br-sm'
                      : 'bg-cloud-50 border border-cyan-pale text-navy-main rounded-bl-sm'
                  }`}
                >
                  <p>{msg.message}</p>
                  <p className={`text-[10px] mt-1 ${isMe ? 'text-white/70' : 'text-ink-muted'}`}>
                    {isMe ? 'You' : msg.profiles?.full_name || 'SkySurfers Team'}
                  </p>
                </div>
              </div>
            );
          })}

          {messages.length === 0 && (
            <p className="text-center text-ink-muted text-xs py-4">No replies yet — our team will respond soon.</p>
          )}

        </div>

        <div className="p-4 border-t border-cyan-pale">
          {error && <p className="text-xs text-rose-600 mb-2">{error}</p>}
          <div className="relative">
            <input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a follow-up…"
              disabled={sending}
              className="w-full pl-4 pr-12 py-3 rounded-full bg-cloud-50 border border-cyan-pale text-navy-main placeholder-ink-muted focus:outline-none focus:ring-2 focus:ring-sky-primary text-sm disabled:opacity-60"
            />
            <button
              onClick={handleSend}
              disabled={sending}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-sky-primary hover:bg-sky-deep text-white transition-colors disabled:opacity-60"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}