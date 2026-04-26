const cheerio = require('cheerio');

async function testRoute(url) {
    try {
        console.log(`\nTesting: ${url}`);
        const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }});
        console.log(`Status: ${res.status}`);
        const text = await res.text();
        if (text.startsWith('{') || text.startsWith('[')) {
             console.log(`Found JSON!: ${text.substring(0, 100)}...`);
             return;
        }
        const $ = cheerio.load(text);
        const nextData = $('#__NEXT_DATA__').html();
        if (nextData) {
            const json = JSON.parse(nextData);
            if (json.props?.pageProps?.archive) {
                console.log("Found archive block!");
            } else if (json.props?.pageProps?.searchResult) {
                console.log("Found searchResult block!");
            } else {
                console.log("Found Next.js Page. Keys: ", Object.keys(json.props?.pageProps || {}));
            }
        }
    } catch(e) { console.log("Error:", e.message); }
}

async function run() {
    await testRoute('https://gnula.life/api/movies/search?q=avatar');
    await testRoute('https://gnula.life/api/search?q=avatar');
    await testRoute('https://gnula.life/search?q=avatar');
    await testRoute('https://gnula.life/?s=avatar');
}
run();
