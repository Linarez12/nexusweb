"use client";

import { useState } from 'react';

type Player = {
    cyberlocker: string;
    result: string;
    quality: string;
};

type PlayersProps = {
    latino: Player[];
    spanish: Player[];
    english: Player[];
};

export default function PlayerSelector({ players }: { players: PlayersProps }) {
    const defaultLang = players.latino.length > 0 ? 'latino' : (players.spanish.length > 0 ? 'spanish' : 'english');
    const [lang, setLang] = useState<'latino' | 'spanish' | 'english'>(defaultLang);
    const [activeIframe, setActiveIframe] = useState<string>(
        players[defaultLang]?.[0]?.result || ''
    );

    const availablePlayers = players[lang] || [];

    if(!players.latino.length && !players.spanish.length && !players.english.length) {
        return (
            <div className="player-placeholder">
                No hay reproductores disponibles. Proxy requerido o bloqueado por el servidor externo.
            </div>
        );
    }

    return (
        <div className="player-container">
            {/* Player */}
            <div className="player-wrapper">
                {activeIframe ? (
                    <iframe 
                        src={activeIframe} 
                        allowFullScreen 
                        scrolling="no" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    ></iframe>
                ) : (
                    <div className="player-placeholder">
                        Selecciona un servidor
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="player-controls">
                <div className="language-tabs">
                    {players.latino.length > 0 && (
                        <button className={`tab-btn ${lang === 'latino' ? 'active' : ''}`} onClick={() => setLang('latino')}>
                            🇲🇽 Latino
                        </button>
                    )}
                    {players.spanish.length > 0 && (
                        <button className={`tab-btn ${lang === 'spanish' ? 'active' : ''}`} onClick={() => setLang('spanish')}>
                            🇪🇸 Castellano
                        </button>
                    )}
                    {players.english.length > 0 && (
                        <button className={`tab-btn ${lang === 'english' ? 'active' : ''}`} onClick={() => setLang('english')}>
                            🇺🇸 Subtitulado
                        </button>
                    )}
                </div>
                
                <div className="server-list">
                    {availablePlayers.map((p, idx) => (
                        <button 
                            key={idx}
                            className={`server-btn ${activeIframe === p.result ? 'active' : ''}`}
                            onClick={() => setActiveIframe(p.result)}
                        >
                            ▶ {p.cyberlocker.toUpperCase()} {p.quality ? `[${p.quality}]` : ''}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
