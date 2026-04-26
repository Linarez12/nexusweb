const cheerio = require('cheerio');
const fs = require('fs');

async function testUrl(url) {
    try {
        const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        if(res.status === 200) {
            const html = await res.text();
            const $ = cheerio.load(html);
            const nextData = $('#__NEXT_DATA__').html();
            if(nextData) {
                console.log(`[SUCCESS] ${url} exists and HAS next data. Length:`, nextData.length);
                const json = JSON.parse(nextData);
                // Look for archives or search results
                if(json.props?.pageProps?.archive) {
                     console.log("  - Found Archive block with", json.props.pageProps.archive.data?.length, "items.");
                }
            } else {
               console.log(`[SUCCESS] ${url} exists but NO next data.`);
            }
        } else {
            console.log(`[FAILED] ${url} returned ${res.status}`);
        }
    } catch(e) {
        console.log(`[ERROR] ${url}`, e.message);
    }
}

async function run() {
    await testUrl('https://gnula.life/archives/movies/page/2');
    await testUrl('https://gnula.life/archives/series/page/2');
    await testUrl('https://gnula.life/search/avatar'); // Try standard TMDB/Dooplay search path
    await testUrl('https://gnula.life/?s=avatar'); 
    await testUrl('https://gnula.life/genres/accion');
    await testUrl('https://gnula.life/genres/action');
}

run();
