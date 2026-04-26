const cheerio = require('cheerio');

async function check() {
    const res = await fetch('https://gnula.life/', { headers: { 'User-Agent': 'Mozilla/5.0' }});
    const html = await res.text();
    const $ = cheerio.load(html);
    const nextData = $('#__NEXT_DATA__').html();
    const json = JSON.parse(nextData);
    const item = json.props.pageProps.sliderItems?.data?.[0];
    console.log(JSON.stringify(item, null, 2));
}

check();
