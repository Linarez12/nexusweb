import { getHomeMovies } from "@/lib/scraper";
import Link from 'next/link';
import HeroBanner from '@/app/components/HeroBanner';

// Next.js ISR (Revalidar cada hora para tener peliculas frescas sin quemar Vercel)
export const revalidate = 3600;

export default async function Home() {
  const { movies, episodes, hero } = await getHomeMovies();

  return (
    <main>
      <HeroBanner items={hero} />

      <div className="container">
        {episodes.length > 0 && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="section-title">Últimos Episodios</h2>
              <Link href="/series" className="btn" style={{ marginTop: 0, padding: '5px 15px', background: 'transparent', border: '1px solid var(--accent-secondary)', color: 'var(--accent-secondary)' }}>VER TODO</Link>
            </div>
            <div className="episodes-grid" style={{ marginBottom: '4rem' }}>
              {episodes.slice(0, 10).map((ep) => (
                <Link href={ep.link} key={`${ep.id}-${ep.epNumber}`} className="episode-card" style={{ textDecoration: 'none' }}>
                  <div className="episode-thumb">
                    <img src={ep.image} alt={ep.title} loading="lazy" />
                  </div>
                  <div className="episode-info">
                    {ep.title}
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="section-title">Últimos Estrenos</h2>
            <Link href="/movies" className="btn" style={{ marginTop: 0, padding: '5px 15px', background: 'transparent', border: '1px solid var(--accent-color)', color: 'var(--accent-color)' }}>VER TODO</Link>
        </div>
        
        <div className="movie-grid">
          {movies.slice(0, 20).map((movie) => (
            <Link href={movie.link} key={movie.id} className="movie-card">
              <img 
                src={movie.image} 
                alt={movie.title} 
                className="movie-poster" 
                loading="lazy" 
              />
              <div className="movie-info">
                <div className="movie-title">{movie.title}</div>
              </div>
            </Link>
          ))}
          
          {movies.length === 0 && (
            <p>No se encontraron películas. (Intentando sincronizar)</p>
          )}
        </div>
      </div>
    </main>
  );
}
