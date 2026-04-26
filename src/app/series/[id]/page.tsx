import { getMovieDetails } from "@/lib/scraper";
import { notFound } from "next/navigation";
import Link from 'next/link';
import SeriesClient from '@/app/components/SeriesClient';

export const revalidate = 3600;

export default async function SeriesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const movie = await getMovieDetails(id, 'series');

  if (!movie) {
    notFound();
  }

    return (
        <main>
            <div className="details-hero" style={{ backgroundImage: `url('${movie.backdrop}')` }}>
                <div className="details-hero-overlay"></div>
                <div className="details-layout">
                    <img src={movie.poster} alt={movie.title} className="details-poster" />
                    <div className="details-text">
                        <h1>{movie.title}</h1>
                        <p>{movie.description}</p>
                        <Link href="/" className="btn" style={{ marginTop: '1rem', display: 'inline-block' }}>← Volver al Inicio</Link>
                    </div>
                </div>
            </div>

            <div className="container" style={{ marginBottom: '4rem' }}>
                {movie.seasons && movie.seasons.length > 0 ? (
                    <SeriesClient seasons={movie.seasons} seriesId={id} />
                ) : (
                    <div className="player-placeholder">Selección de episodios no disponible.</div>
                )}
            </div>
        </main>
    );
}
