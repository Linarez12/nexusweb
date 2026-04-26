import { getPaginatedData } from "@/lib/scraper";
import Link from 'next/link';

export const revalidate = 3600;

type GenreProps = {
    params: Promise<{ name: string }>;
}

export default async function GenrePage({ params }: GenreProps) {
    const { name } = await params;
    const items = await getPaginatedData(`/genres/${name}`);

    return (
        <main className="container">
            <h2 className="section-title">Género: {name.toUpperCase()}</h2>
            
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
                    <p>No se encontró contenido para este género.</p>
                )}
            </div>
        </main>
    );
}
