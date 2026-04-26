"use client";

import { useState } from 'react';
import PlayerSelector from './PlayerSelector';

type Episode = {
    title: string;
    number: number;
    image: string;
    slug: {
        name: string;
        season: string;
        episode: string;
    }
};

type Season = {
    number: number;
    episodes: Episode[];
};

export default function SeriesClient({ seasons, seriesId }: { seasons: Season[], seriesId: string }) {
    const [openSeason, setOpenSeason] = useState<number | null>(seasons[0]?.number || null);
    
    // Modal State
    const [loadingParams, setLoadingParams] = useState<Episode | null>(null);
    const [modalPlayers, setModalPlayers] = useState<any>(null);

    const openEpisode = async (ep: Episode) => {
        setLoadingParams(ep);
        setModalPlayers(null);

        try {
            const res = await fetch(`/api/episode?seriesId=${seriesId}&season=${ep.slug.season}&episode=${ep.slug.episode}`);
            const data = await res.json();
            if (data.players) {
                setModalPlayers(data.players);
            } else {
                alert("Error al cargar los reproductores.");
            }
        } catch (e) {
            console.error("Error loading episode", e);
            alert("Error en la conexión");
        }
    };

    const closeModal = () => {
        setLoadingParams(null);
        setModalPlayers(null);
    };

    return (
        <div className="series-container">
            {/* Acordeón de Temporadas */}
            <div className="seasons-list">
                {seasons.map(s => (
                    <div key={s.number} className="season-card">
                        <button 
                            className="season-header" 
                            onClick={() => setOpenSeason(openSeason === s.number ? null : s.number)}
                        >
                            <h2>Temporada {s.number}</h2>
                            <span>{openSeason === s.number ? '▲' : '▼'}</span>
                        </button>
                        
                        {openSeason === s.number && (
                            <div className="episodes-grid">
                                {s.episodes.map(ep => (
                                    <div 
                                        key={ep.number} 
                                        className="episode-card"
                                        onClick={() => openEpisode(ep)}
                                    >
                                        <div className="episode-thumb">
                                            <img src={ep.image} alt={ep.title} loading="lazy" />
                                            <div className="play-icon">▶</div>
                                        </div>
                                        <div className="episode-info">
                                            <span className="ep-num">{ep.number}.</span> {ep.title}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Modal Premium */}
            {loadingParams && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="modal-close" onClick={closeModal}>X</button>
                        <h2 className="modal-title">{loadingParams.title}</h2>
                        
                        {modalPlayers ? (
                           <PlayerSelector players={modalPlayers} />
                        ) : (
                           <div className="modal-loader">
                               <div className="spinner"></div>
                               <p>Conectando con el Servidor Nexus...</p>
                           </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
