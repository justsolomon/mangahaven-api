const rp = require("request-promise");
const { parse } = require("node-html-parser");
const { baseUrl, scrapeScript } = require("../utils");

exports.getAllGenres = (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");

  fetchSearchPage((genres, allManga) => {
    let allGenreManga = [];
    for (genre of genres) {
      let genreManga = getMangaInGenre(genre, allManga, 100);
      allGenreManga.push({
        genre,
        genreManga,
      });
    }
    res.send(allGenreManga);
  });
};

exports.getSingleGenre = (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  const { genreName } = req.params;

  fetchSearchPage((genres, allManga) => {
    if (genres.includes(genreName)) {
      let genreManga = getMangaInGenre(genreName, allManga, Infinity);
      console.log(genreManga.length);
      res.send(genreManga);
    }
  });
};

const fetchSearchPage = (callback) => {
  rp(`${baseUrl}/search`)
    .then((html) => {
      const root = parse(html);
      const filters = scrapeScript(root, "vm.AvailableFilters", "vm.Warning");
      const allManga = JSON.parse(
        scrapeScript(root, "vm.Directory", "vm.GetIntValue")
      );

      const genres = JSON.parse(filters.replace(/'/g, '"')).Genre;
      callback(genres, allManga);
    })
    .catch((err) => console.log(err));
};

const getMangaInGenre = (genre, allManga, max) => {
  let genreManga = [];
  let count = 0;

  for (manga of allManga) {
    if (count === max) break;
    else {
      const { i, s, g } = manga;
      if (g.includes(genre)) {
        genreManga.push({
          imageUrl: `https://cover.nep.li/cover/${i}.jpg`,
          name: s,
          serialName: i,
        });
        count++;
      }
    }
  }

  return genreManga;
};
