const cheerio = require('cheerio');

async function scrape() {
  const res = await fetch('https://gnula.life/movies/proyecto-fin-del-mundo');
  const html = await res.text();
  const $ = cheerio.load(html);
  
  // Imprimir si existe el script de Next.js
  const nextData = $('#__NEXT_DATA__').html();
  if (nextData) {
      console.log("NEXT_DATA exists, length:", nextData.length);
      try {
          const json = JSON.parse(nextData);
          // Podemos buscar los links de video en los props
          console.log("Found next data JSON");
          require('fs').writeFileSync('next_data.json', JSON.stringify(json, null, 2));
      } catch (e) {
          console.log(e);
      }
  }

  // Veamos qué iframes hay
  let iframes = [];
  $('iframe').each((i, el) => {
      iframes.push($(el).attr('src'));
  });
  console.log("Iframes:", iframes);
  
  console.log("Title h1:", $('h1').text().trim());
}

scrape();
