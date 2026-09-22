import React from 'react';

export default function StatusBadge({ status }) {

    const getStyle = () => {

        switch (status?.toLowerCase()) {

            case 'confirmed':

            case 'fully_paid':

            case 'verified':

                return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';

            case 'pending':

            case 'partial':

            case 'submitted':

                return 'bg-amber-500/10 text-amber-400 border-amber-500/20';

            case 'cancelled':

            case 'rejected':

                return 'bg-rose-500/10 text-rose-400 border-rose-500/20';

            default:

                return 'bg-slate-500/10 text-slate-400 border-slate-500/20';

        }

    };

    return (

        <span className={`text-xs px-2.5 py-1 rounded-full border font-medium capitalize ${getStyle()}`}>

            {status?.replace('_', ' ')}

        </span>

    );
    
}