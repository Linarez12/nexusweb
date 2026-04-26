import { getPaginatedData } from "@/lib/scraper";
import Link from 'next/link';

export const revalidate = 3600;

type PageProps = {
    params: Promise<{ num: string }>;
}

export default async function MoviesPage({ params }: PageProps) {
    const { num } = await params;
    const pageNum = parseInt(num) || 1;
    
    // Gnula usa /archives/movies/page/2. Si es 1, omitimos page.
    const route = pageNum > 1 ? `/archives/movies/page/${pageNum}` : `/archives/movies`;
    const items = await getPaginatedData(route);

    return (
        <main className="container">
            <h2 className="section-title">Películas - Página {pageNum}</h2>
            
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
                {pageNum > 1 && (
                    <Link href={`/movies/page/${pageNum - 1}`} className="btn">Página Anterior</Link>
                )}
                {items.length > 10 && (
                    <Link href={`/movies/page/${pageNum + 1}`} className="btn">Página Siguiente</Link>
                )}
            </div>
        </main>
    );
}
