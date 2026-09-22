import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { MessageSquare, Send } from 'lucide-react';


const URGENCY_STYLES = {
  urgent: 'bg-rose-100 text-rose-700',
  new: 'bg-sky-100 text-sky-700',
  done: 'bg-emerald-100 text-emerald-700',
};

const STATUS_STYLES = {
  open: 'bg-amber-100 text-amber-700',
  in_progress: 'bg-sky-100 text-sky-700',
  resolved: 'bg-emerald-100 text-emerald-700',
};

const STATUSES = ['open', 'in_progress', 'resolved'];
const URGENCIES = ['urgent', 'new', 'done'];


export default function AdminInquiriesPage() {
  const { user } = useAuth();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedId, setSelectedId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyNotice, setReplyNotice] = useState(false);

  useEffect(() => { fetchInquiries(); }, []);

  const fetchInquiries = async () => {
    setLoading(true);
        const { data, error } = await supabase
        .from('inquiries')
        .select('*, profiles!inquiries_customer_id_fkey(full_name, contact_number)')
        .order('created_at', { ascending: false });

    if (error) setError(error.message);
    else setInquiries(data || []);
    setLoading(false);
  };

  const updateField = async (id, field, value) => {
    const { error } = await supabase.from('inquiries').update({ [field]: value }).eq('id', id);
    if (error) setError(error.message);
    else fetchInquiries();
  };

  const assignToMe = async (id) => {
    await updateField(id, 'assigned_to', user.id);
  };

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    setReplyNotice(true);
  };

  const filtered = statusFilter === 'all' ? inquiries : inquiries.filter((i) => i.status === statusFilter);
  const selected = inquiries.find((i) => i.id === selectedId);

  return (
    <div className="p-6 h-screen flex flex-col">

      <div className="mb-4">
        <h1 className="text-2xl font-bold text-navy-main">Inquiries</h1>
        <p className="text-ink-secondary text-sm">Customer inquiries from the website, Facebook, and SkyBot.</p>
      </div>

      <div className="flex gap-2 mb-4">
        {['all', ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize ${
              statusFilter === s ? 'bg-sky-primary text-white' : 'bg-white border border-cyan-pale text-ink-secondary hover:border-sky-primary'
            }`}
          >
            {s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {error && <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2 mb-4">{error}</p>}

      <div className="flex-1 flex gap-4 min-h-0">

        <div className="w-80 bg-white border border-cyan-pale rounded-xl shadow-soft overflow-y-auto">
          {loading ? (
            <p className="p-4 text-sm text-ink-secondary">Loading…</p>
          ) : filtered.length === 0 ? (
            <p className="p-4 text-sm text-ink-secondary">No inquiries in this filter.</p>
          ) : (
            filtered.map((inq) => (
              <button
                key={inq.id}
                onClick={() => setSelectedId(inq.id)}
                className={`w-full text-left p-4 border-b border-cyan-pale hover:bg-cloud-50 transition-colors ${selectedId === inq.id ? 'bg-cloud-100' : ''}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-navy-main text-sm">{inq.profiles?.full_name || 'Unknown'}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${URGENCY_STYLES[inq.urgency]}`}>
                    {inq.urgency}
                  </span>
                </div>
                <p className="text-xs text-ink-secondary line-clamp-2">{inq.message}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_STYLES[inq.status]}`}>
                    {inq.status.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] text-ink-muted capitalize">{inq.source}</span>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="flex-1 bg-white border border-cyan-pale rounded-xl shadow-soft flex flex-col overflow-hidden">
          {!selected ? (
            <div className="flex-1 flex items-center justify-center text-ink-muted text-sm">
              <div className="text-center">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 text-cyan-pale" />
                Select an inquiry to view details
              </div>
            </div>
          ) : (
            <>
              <div className="p-5 border-b border-cyan-pale">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="font-bold text-navy-main">{selected.profiles?.full_name || 'Unknown'}</h2>
                    <p className="text-xs text-ink-muted">{selected.profiles?.contact_number} • via {selected.source}</p>
                  </div>
                  {!selected.assigned_to && (
                    <button
                      onClick={() => assignToMe(selected.id)}
                      className="text-xs font-semibold text-sky-primary border border-sky-primary rounded-lg px-3 py-1.5 hover:bg-cloud-100"
                    >
                      Assign to me
                    </button>
                  )}
                </div>

                <div className="flex gap-3">
                  <select
                    value={selected.urgency}
                    onChange={(e) => updateField(selected.id, 'urgency', e.target.value)}
                    className={`text-xs font-semibold px-2 py-1.5 rounded-lg border border-cyan-pale capitalize ${URGENCY_STYLES[selected.urgency]}`}
                  >
                    {URGENCIES.map((u) => <option key={u} value={u}>{u}</option>)}
                  </select>

                  <select
                    value={selected.status}
                    onChange={(e) => updateField(selected.id, 'status', e.target.value)}
                    className={`text-xs font-semibold px-2 py-1.5 rounded-lg border border-cyan-pale capitalize ${STATUS_STYLES[selected.status]}`}
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5">
                <div className="bg-cloud-50 border border-cyan-pale rounded-xl p-4 max-w-lg">
                  <p className="text-sm text-navy-main">{selected.message}</p>
                </div>
              </div>

              <div className="p-4 border-t border-cyan-pale">
                {replyNotice && (
                  <p className="text-xs text-violet-600 bg-violet-50 border border-violet-200 rounded-lg px-3 py-2 mb-2">
                    ✨ Sending isn't wired up yet — there's no messages table to store replies in. This needs both a schema addition and a teammate's Gemini integration before it's real.
                  </p>
                )}
                <div className="relative">
                  <input
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type a reply…"
                    className="w-full pl-4 pr-12 py-3 rounded-full bg-cloud-50 border border-cyan-pale text-navy-main placeholder-ink-muted focus:outline-none focus:ring-2 focus:ring-sky-primary text-sm"
                  />
                  <button
                    onClick={handleSendReply}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-sky-primary hover:bg-sky-deep text-white transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}