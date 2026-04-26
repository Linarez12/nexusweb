const cheerio = require('cheerio');

async function scrape() {
  const res = await fetch('https://gnula.life/');
  const html = await res.text();
  const $ = cheerio.load(html);
  
  const movies = [];
  
  // They have article.item and other structures
  $('article, .item').slice(0, 8).each((i, el) => {
    const title = $(el).find('h3 a, .title').text().trim() || $(el).find('img').attr('alt');
    const link = $(el).find('a').first().attr('href') || $(el).find('a').attr('href');
    const image = $(el).find('img').attr('src');
    
    if(title) {
        movies.push({ title, link, image });
    }
  });

  console.log("Found movies: ", movies.length);
  console.log(JSON.stringify(movies, null, 2));
}

scrape();
