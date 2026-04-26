import { getPaginatedData } from "@/lib/scraper";
import Link from 'next/link';

export const revalidate = 0; // Buscador dinámico, siempre activo

type SearchProps = {
    searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchProps) {
    const { q } = await searchParams;
    // Map to gnula's explicit json search endpoint
    const items = q ? await getPaginatedData(`/search?q=${encodeURIComponent(q)}`) : [];

    return (
        <main className="container">
            <h2 className="section-title">Resultados para: "{q}"</h2>
            
            <div className="movie-grid">
                {items.length > 0 ? (
                    items.map((item) => (
                        <Link href={`/${item.type}/${item.id}`} key={`${item.type}-${item.id}`} className="movie-card">
                            <img 
                                src={item.image} 
                                alt={item.title} 
                                className="movie-poster" 
                                loading="lazy" 
                            />
                            <div className="movie-info">
                                <div className="movie-title">{item.title}</div>
                            </div>
                            {item.type === 'series' && (
                                <div style={{position: 'absolute', top: 10, right: 10, background: 'var(--accent-secondary)', padding: '2px 8px', borderRadius: 10, fontSize: '0.8rem', fontWeight: 'bold'}}>
                                    SERIE
                                </div>
                            )}
                        </Link>
                    ))
                ) : (
                    <p style={{ gridColumn: '1 / -1', textAlign: 'center', margin: '3rem 0', color: 'var(--text-secondary)' }}>
                        No se encontraron series ni películas que coincidan con tu búsqueda.
                    </p>
                )}
            </div>
        </main>
    );
}
