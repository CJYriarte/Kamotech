import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { Share2 } from 'lucide-react';


const URGENCY_STYLES = {
  urgent: 'bg-rose-100 text-rose-700',
  new: 'bg-sky-100 text-sky-700',
  done: 'bg-emerald-100 text-emerald-700',
};


export default function AdminFollowUpsPage() {
  const [activeTab, setActiveTab] = useState('followups');
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeTab === 'followups') fetchFollowUps();
  }, [activeTab]);

  const fetchFollowUps = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('inquiries')
      .select('*, profiles(full_name, contact_number)')
      .in('status', ['open', 'in_progress'])
      .order('urgency', { ascending: true })
      .order('created_at', { ascending: true });

    setFollowUps(data || []);
    setLoading(false);
  };

  return (
    <div className="p-6 space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-navy-main">Follow-Ups &amp; Post History</h1>
        <p className="text-ink-secondary text-sm">Track open customer follow-ups and past marketing activity.</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('followups')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold ${
            activeTab === 'followups' ? 'bg-sky-primary text-white' : 'bg-white border border-cyan-pale text-ink-secondary'
          }`}
        >
          Follow-Ups
        </button>
        <button
          onClick={() => setActiveTab('posts')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold ${
            activeTab === 'posts' ? 'bg-sky-primary text-white' : 'bg-white border border-cyan-pale text-ink-secondary'
          }`}
        >
          Post History
        </button>
      </div>

      {activeTab === 'followups' && (
        <div className="bg-white rounded-xl border border-cyan-pale shadow-soft overflow-hidden">
          {loading ? (
            <p className="p-6 text-sm text-ink-secondary">Loading…</p>
          ) : followUps.length === 0 ? (
            <p className="p-6 text-sm text-ink-secondary">No open inquiries need following up right now.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-cloud-100 text-ink-secondary text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Message</th>
                  <th className="px-4 py-3 font-medium">Urgency</th>
                  <th className="px-4 py-3 font-medium">Waiting Since</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyan-pale">
                {followUps.map((f) => (
                  <tr key={f.id}>
                    <td className="px-4 py-3 font-medium text-navy-main">{f.profiles?.full_name || '—'}</td>
                    <td className="px-4 py-3 text-ink-secondary max-w-xs truncate">{f.message}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full uppercase ${URGENCY_STYLES[f.urgency]}`}>
                        {f.urgency}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-ink-secondary">{new Date(f.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === 'posts' && (
        <div className="bg-white rounded-xl border border-cyan-pale shadow-soft p-10 text-center">
          <Share2 className="w-8 h-8 mx-auto mb-3 text-cyan-pale" />
          <h2 className="font-bold text-navy-main mb-1">No post history yet</h2>
          <p className="text-ink-secondary text-sm max-w-sm mx-auto">
            Social media post tracking isn't part of the database yet — this needs a dedicated table before it can show real data.
          </p>
        </div>
      )}

    </div>
  );
}