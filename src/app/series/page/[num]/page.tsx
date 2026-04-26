import { getPaginatedData } from "@/lib/scraper";
import Link from 'next/link';

export const revalidate = 3600;

type PageProps = {
    params: Promise<{ num: string }>;
}

export default async function SeriesArchivePage({ params }: PageProps) {
    const { num } = await params;
    const pageNum = parseInt(num) || 1;
    
    const route = pageNum > 1 ? `/archives/series/page/${pageNum}` : `/archives/series`;
    const items = await getPaginatedData(route);

    return (
        <main className="container">
            <h2 className="section-title">Series - Página {pageNum}</h2>
            
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
                    <p>No se encontraron series en esta página.</p>
                )}
            </div>

            <div className="pagination">
                {pageNum > 1 && (
                    <Link href={`/series/page/${pageNum - 1}`} className="btn">Página Anterior</Link>
                )}
                {items.length > 10 && (
                    <Link href={`/series/page/${pageNum + 1}`} className="btn">Página Siguiente</Link>
                )}
            </div>
        </main>
    );
}
