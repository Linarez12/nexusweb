import { getPaginatedData } from "@/lib/scraper";
import Link from 'next/link';

export const revalidate = 3600;

export default async function MoviesIndexPage() {
    const items = await getPaginatedData(`/archives/movies`);

    return (
        <main className="container">
            <h2 className="section-title">Películas - Página 1</h2>
            
            <div className="movie-grid">
                {items.length > 0 ? (
                    items.map((item) => (
                        <Link href={`/${item.type}/${item.id}`} key={`${item.type}-${item.id}`} className="movie-card">
                            <img src={item.image} alt={item.title} className="movie-poster" loading="lazy" />
                            <div className="movie-info">
                                <div className="movie-title">{item.title}</div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p>No se encontraron películas en esta página.</p>
                )}
            </div>

            <div className="pagination">
                {items.length > 10 && (
                    <Link href={`/movies/page/2`} className="btn">Página Siguiente</Link>
                )}
            </div>
        </main>
    );
}
