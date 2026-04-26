const cheerio = require('cheerio');
const fs = require('fs');

async function testSearch(url) {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const html = await res.text();
    const $ = cheerio.load(html);
    const nextData = $('#__NEXT_DATA__').html();
    if(nextData) {
        const json = JSON.parse(nextData);
        fs.writeFileSync('search_data.json', JSON.stringify(json.props.pageProps, null, 2));
        console.log("Search props saved");
    }
}

testSearch('https://gnula.life/?s=avatar'); 
