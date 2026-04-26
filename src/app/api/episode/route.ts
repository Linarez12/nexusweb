import { NextResponse } from 'next/server';
import { getEpisodeServers } from '@/lib/scraper';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const seriesId = searchParams.get('seriesId');
    const season = searchParams.get('season');
    const episode = searchParams.get('episode');

    if (!seriesId || !season || !episode) {
        return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 });
    }

    try {
        const players = await getEpisodeServers(seriesId, season, episode);
        
        if (!players) {
            return NextResponse.json({ error: 'No se encontraron reproductores' }, { status: 404 });
        }

        return NextResponse.json({ players });
    } catch (e) {
        return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
    }
}
