const rp = require("request-promise");
const { parse } = require("node-html-parser");
const { baseUrl, scrapeScript } = require("../utils");

exports.getMangaDetails = (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  const { name } = req.params;

  rp(`${baseUrl}manga/${name}`)
    .then((html) => {
      const root = parse(html);

      const manga = fetchMangaInfo(root, name);
      const chapters = JSON.parse(
        scrapeScript(root, "vm.Chapters", "vm.NumSubs")
      );

      for (chapter of chapters) {
        chapter.chapterNum = getChapterNumber(chapter.Chapter);
        delete chapter.Chapter;
        delete chapter.Type;
      }

      manga.lastChapter = chapters[0].chapterNum;
      manga.updated = chapters[0].Date;

      res.send(JSON.stringify({ ...manga, chapters }));
    })
    .catch((err) => console.log(err));
};

const fetchMangaInfo = (root, name) => {
  const manga = {
    alias: name,
    imageUrl: `https://cover.nep.li/cover/${name}.jpg`,
    name: root.querySelector("h1").rawText,
    description: root.querySelector(".Content").rawText,
  };

  for (detail of root.querySelectorAll(".list-group-item")) {
    let text = detail.rawText.trim().replace(/(\r\n|\n|\r|\t)/gm, "");
    if (text.startsWith("Alt"))
      manga.altName = text.replace("Alternate Name(s): ", "");
    if (text.startsWith("Author"))
      manga.author = text.replace("Author(s): ", "");
    if (text.startsWith("Release"))
      manga.released = text.replace("Released: ", "");
    if (text.startsWith("Type")) manga.type = text.replace("Type: ", "");
    if (text.startsWith("Status"))
      manga.status = text.replace("Status: ", "").startsWith("Complete")
        ? "Completed"
        : "Ongoing";
    if (text.startsWith("Genre"))
      manga.genres = text.replace("Genre(s): ", "").split(", ");
  }

  return manga;
};

const getChapterNumber = (chapterString) => {
  let chapter = parseInt(chapterString.slice(1, -1));
  let odd = chapterString[chapterString.length - 1];
  if (odd == 0) {
    return chapter;
  } else {
    return chapter + "." + odd;
  }
};

exports.getChapterNumber = getChapterNumber;
