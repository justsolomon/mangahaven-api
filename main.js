const express = require("express");
const {
  getAllGenres,
  getSingleGenre,
} = require("./controllers/genreController");
const {
  getAllManga,
  getHotManga,
  getRecentManga,
} = require("./controllers/homeController");
const { getMangaDetails } = require("./controllers/mangaController");
const { getChapterImages } = require("./controllers/chapterController");

const app = express();

app.get("/", getAllManga);

app.get("/hot", getHotManga);

app.get("/recent", getRecentManga);

app.get("/all-genres", getAllGenres);

app.get("/genre/:genreName", getSingleGenre);

app.get("/manga/:name", getMangaDetails);

app.get("/:mangaName/chapter/:chapterNumber", getChapterImages);

app.listen(process.env.PORT || 3000, function () {
  console.log(
    `Server listening on port ${this.address().port} in ${
      app.settings.env
    } mode`
  );
});
