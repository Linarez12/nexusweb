const cheerio = require('cheerio');
const fs = require('fs');

async function scrape() {
  const res = await fetch('https://gnula.life/series/from');
  const html = await res.text();
  const $ = cheerio.load(html);
  
  const nextData = $('#__NEXT_DATA__').html();
  if (nextData) {
      const json = JSON.parse(nextData);
      fs.writeFileSync('next_data_series.json', JSON.stringify(json, null, 2));
      console.log("Series JSON saved");
  }
}
scrape();
