const cheerio = require('cheerio');

async function check() {
    const res = await fetch('https://gnula.life/', { headers: { 'User-Agent': 'Mozilla/5.0' }});
    const html = await res.text();
    const $ = cheerio.load(html);
    const nextData = $('#__NEXT_DATA__').html();
    const json = JSON.parse(nextData);
    const eps = json.props.pageProps.lastEpisodes.data;
    console.log(JSON.stringify(eps[0], null, 2));
}

check();
