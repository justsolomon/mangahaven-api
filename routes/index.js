const express = require("express");
const {
  getAllGenres,
  getSingleGenre,
} = require("../controllers/genreController");
const {
  getAllManga,
  getHotManga,
  getRecentManga,
} = require("../controllers/homeController");
const { getMangaDetails } = require("../controllers/mangaController");
const { getChapterImages } = require("../controllers/chapterController");

const router = express.Router();

router.get("/", getAllManga);
router.get("/hot", getHotManga);
router.get("/recent", getRecentManga);
router.get("/all-genres", getAllGenres);
router.get("/genre/:genreName", getSingleGenre);
router.get("/manga/:name", getMangaDetails);
router.get("/:mangaName/chapter/:chapterNumber", getChapterImages);
