import React from 'react';

import { Link, useLocation } from 'react-router-dom';

import { Bot } from 'lucide-react';

export default function SkyBotLauncher() {

    const location = useLocation();

    if (location.pathname === '/chat') return null; // this will dont show in the chat page itself

    return (

        <Link 

            to="/chat"

            className="fixed bottom-6 right-6 z-40 bg-sky-500 hover:bg-sky-400 text-slate-950 p-4 rounded-full shadow-lg shadow-sky-500/30 transition-transform hover:scale-105"

        >

            <Bot className="w-5 h-5" />

        </Link>
            
    );


}