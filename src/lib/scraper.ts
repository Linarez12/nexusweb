import * as cheerio from 'cheerio';

const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
};

function extractImage(img: string | undefined) {
    if (!img) return '';
    if (img.includes('/_next/image?url=')) {
        const urlParam = new URLSearchParams(img.split('?')[1]).get('url');
        if (urlParam) return decodeURIComponent(urlParam);
    }
    if (img.startsWith('/')) return 'https://gnula.life' + img;
    return img;
}

export async function getHomeMovies() {
    try {
        const res = await fetch('https://gnula.life/', { cache: 'no-store', headers });
        const html = await res.text();
        const $ = cheerio.load(html);
        const nextData = $('#__NEXT_DATA__').html();
        
        let movies: any[] = [];
        let episodes: any[] = [];
        let hero: any[] = [];

        if(nextData) {
            const json = JSON.parse(nextData);
            const props = json.props?.pageProps;
            if(props) {
                // Agregar listados de peliculas/series
                const addList = (dataList: any[], type: 'movie' | 'series', targetArray: any[]) => {
                    if(!dataList) return;
                    dataList.forEach((item: any) => {
                        // Para episodios, item.serie.slug.name o item.slug.name (que es el id de la serie)
                        const id = item.serie?.slug?.name || item.slug?.name || item.TMDbId;
                        if(id && !targetArray.find(m => m.id === id && m.epNumber === item.slug?.episode)) {
                            let title = item.title || item.titles?.name || item.serie?.titles?.name || 'Desconocido';
                            if (type === 'episode' && item.slug && !title.includes('x')) {
                                title += ` ${item.slug.season}x${item.slug.episode}`;
                            }

                            targetArray.push({
                                title: title,
                                link: `/series/${id}`, // Clic de un episodio siempre te lleva a la serie original configurada
                                image: extractImage(item.image || item.images?.backdrop || item.images?.poster || item.serie?.images?.backdrop),
                                id: id,
                                type: type === 'episode' ? 'series' : type,
                                epNumber: item.slug?.episode
                            });
                        }
                    });
                };

                addList(props.lastMovies?.data, 'movie', movies);
                addList(props.moviesBet?.data, 'movie', movies);
                addList(props.lastSeries?.data, 'series', movies);
                // Extracción de episodios nuevos
                addList(props.lastEpisodes?.data, 'episode' as any, episodes);
                
                // Extracción del Hero Banner
                if(props.sliderItems?.data) {
                    props.sliderItems.data.forEach((item: any) => {
                        hero.push({
                            title: item.titles?.name || 'Desconocido',
                            link: `/movie/${item.slug?.name || item.TMDbId}`,
                            backdrop: extractImage(item.images?.backdrop || item.images?.poster)
                        });
                    });
                }
            }
        }
        return { movies, episodes, hero };
    } catch(error) {
        console.error("Scrape error:", error);
        return { movies: [], episodes: [], hero: [] };
    }
}

export async function getPaginatedData(route: string) {
    // Para rutas tipo: '/archives/movies/page/2', '/genres/accion', '/search?q=avatar'
    try {
        const url = `https://gnula.life${route}`;
        const res = await fetch(url, { cache: 'no-store', headers });
        const html = await res.text();
        const $ = cheerio.load(html);
        const nextData = $('#__NEXT_DATA__').html();
        
        let items: any[] = [];
        if(nextData) {
            const json = JSON.parse(nextData);
            const props = json.props?.pageProps;
            
            // Try archive (Pagination/Genres)
            let dataList = props?.archive?.data;
            
            // Try explicit Search results endpoint
            if(!dataList && props?.results?.data) {
                dataList = props.results.data;
            }

            let type = route.includes('/series') ? 'series' : 'movie';

            // Si es desde /search, detectamos si es de TV o Película según tenga número de temporadas o su 'media_type' original.
            // O podríamos forzar type dinámico por iteración.
            
            if(dataList) {
                dataList.forEach((item: any) => {
                    const id = item.slug?.name || item.TMDbId;
                    // Detectar si es serie revisando si tiene numberOfSeasons o temporadas. Gnula Search aveces incluye 'mediaType'.
                    const isSerieConfig = item.seasons || item.numberOfSeasons || (item.slug?.name && item.slug.name.includes('series')) ? 'series' : type;

                    if(id && !items.find(m => m.id === id)) {
                        items.push({
                            title: item.titles?.name || 'Desconocido',
                            link: `/${isSerieConfig}/${id}`,
                            image: extractImage(item.images?.poster || item.images?.backdrop),
                            id: id,
                            type: isSerieConfig
                        });
                    }
                });
            }
        }
        return items;
    } catch(error) {
        console.error("Pagination scrape error:", error);
        return [];
    }
}

export async function getMovieDetails(id: string, type: 'movie' | 'series' = 'movie') {
    try {
        const url = `https://gnula.life/${type === 'series' ? 'series' : 'movies'}/${id}`;
        const res = await fetch(url, { cache: 'no-store', headers });
        const html = await res.text();
        const $ = cheerio.load(html);

        const nextData = $('#__NEXT_DATA__').html();
        if (nextData) {
            const json = JSON.parse(nextData);
            const post = json.props?.pageProps?.post || json.props?.pageProps?.serie;
            
            if (post) {
                const title = post.titles?.name || $('h1').first().text().trim();
                let description = post.overview || 'Sin descripción disponible.';
                 // Separar Backdrop y Poster explícitamente para el nuevo diseño inmersivo
                let backdrop = extractImage(post.images?.backdrop || post.images?.poster);
                let poster = extractImage(post.images?.poster || post.images?.backdrop);
                
                // Extraer todos los reproductores organizados
                let groupedPlayers = { latino: [] as any[], spanish: [] as any[], english: [] as any[] };
                if (post.players) {
                    groupedPlayers.latino = post.players.latino || [];
                    groupedPlayers.spanish = post.players.spanish || [];
                    groupedPlayers.english = post.players.english || [];
                }

                // Si es serie, enviar las temporadas
                let seasons = [];
                if (type === 'series' && post.seasons) {
                    seasons = post.seasons;
                }

                return { title, description, backdrop, poster, players: groupedPlayers, seasons };
            }
        }
        return null; // Fallback removido, next.js JSON es requerido.
    } catch(error) {
        console.error("Scrape detail error:", error);
        return null;
    }
}

export async function getEpisodeServers(seriesId: string, season: string, episode: string) {
    try {
        const url = `https://gnula.life/series/${seriesId}/seasons/${season}/episodes/${episode}`;
        const res = await fetch(url, { cache: 'no-store', headers });
        const html = await res.text();
        const $ = cheerio.load(html);

        const nextData = $('#__NEXT_DATA__').html();
        if (nextData) {
            const json = JSON.parse(nextData);
            const epData = json.props?.pageProps?.episode;
            if (epData && epData.players) {
                return {
                    latino: epData.players.latino || [],
                    spanish: epData.players.spanish || [],
                    english: epData.players.english || []
                };
            }
        }
        return null;
    } catch (error) {
        console.error("Scrape episode error:", error);
        return null;
    }
}
