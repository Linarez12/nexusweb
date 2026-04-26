"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

type HeroItem = {
    title: string;
    link: string;
    backdrop: string;
};

export default function HeroBanner({ items }: { items: HeroItem[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Si no hay items, no renderizamos nada
    if (!items || items.length === 0) return null;

    // useEffect para rotar la imagen cada 8 segundos
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % items.length);
        }, 8000);
        return () => clearInterval(interval);
    }, [items]);

    const activeItem = items[currentIndex];

    // Placeholder image fallback if needed
    const bgImage = activeItem.backdrop || 'https://via.placeholder.com/1920x1080?text=No+Background';

    return (
        <div className="hero-banner" style={{ backgroundImage: `url('${bgImage}')` }}>
            <div className="hero-vignette"></div>
            <div className="hero-content">
                <h1 className="hero-title">{activeItem.title}</h1>
                <div className="hero-actions">
                    <Link href={activeItem.link} className="hero-btn-play">
                        <span className="icon">▶</span> Reproducir
                    </Link>
                    <Link href={activeItem.link} className="hero-btn-info">
                        <span className="icon">ℹ</span> Más información
                    </Link>
                </div>
            </div>
            
            {/* Dots navigation */}
            <div className="hero-dots">
                {items.map((_, idx) => (
                    <button 
                        key={idx} 
                        className={`dot ${idx === currentIndex ? 'active' : ''}`}
                        onClick={() => setCurrentIndex(idx)}
                        aria-label={`Ir a banner ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
