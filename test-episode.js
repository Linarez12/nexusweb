const cheerio = require('cheerio');
const fs = require('fs');

async function scrape() {
  const url = 'https://gnula.life/series/from/seasons/1/episodes/1';
  console.log("Fetching:", url);
  const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const html = await res.text();
  const $ = cheerio.load(html);
  
  const nextData = $('#__NEXT_DATA__').html();
  if (nextData) {
      const json = JSON.parse(nextData);
      fs.writeFileSync('next_data_episode.json', JSON.stringify(json, null, 2));
      console.log("Episode JSON saved, length:", nextData.length);
      const post = json.props?.pageProps?.post;
      if (post && post.players) {
          console.log("Players found:", Object.keys(post.players));
      }
  } else {
      console.log("No next data");
  }
}
scrape();
