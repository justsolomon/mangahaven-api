const rp = require("request-promise");
const { parse } = require("node-html-parser");
const { baseUrl, scrapeScript } = require("../utils");
const { getChapterNumber } = require("./mangaController");

exports.getChapterImages = (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  const { mangaName, chapterNumber } = req.params;

  rp(`${baseUrl}read-online/${mangaName}-chapter-${chapterNumber}`)
    .then((html) => {
      const root = parse(html);
      const imageDomain = JSON.parse(
        scrapeScript(root, "vm.CurPathName", "vm.CHAPTER")
      );
      const chapter = JSON.parse(
        scrapeScript(root, "vm.CurChapter", "vm.CurPathName")
      );
      const allChapters = JSON.parse(
        scrapeScript(root, "vm.CHAPTERS", "vm.IndexName")
      );
      const mangaFullName = JSON.parse(
        scrapeScript(root, "vm.SeriesName", "vm.LoggedIn")
      );
      let images = getImageURLs(
        Number(chapter.Page),
        imageDomain,
        mangaName,
        chapterNumber
      );
      let prevAndNext = getPrevAndNext(chapter, allChapters);
      let chapterDetails = { images, ...prevAndNext, mangaName: mangaFullName };
      res.send(chapterDetails);
    })
    .catch((err) => console.log(err));
};

const getPrevAndNext = (current, allChapters) => {
  let index;
  let chaptersLength = allChapters.length;
  for (let i = 0; i < chaptersLength; i++) {
    if (allChapters[i].Chapter === current.Chapter) {
      index = i;
      break;
    }
  }

  let currentChapter = allChapters[index];
  currentChapter.chapterNum = getChapterNumber(currentChapter.Chapter);
  delete currentChapter.Chapter;
  delete currentChapter.Type;
  delete currentChapter.Directory;

  let prevChapter = allChapters[index - 1];
  let nextChapter = allChapters[index + 1];
  if (prevChapter) {
    prevChapter.chapterNum = getChapterNumber(prevChapter.Chapter);
    delete prevChapter.Chapter;
    delete prevChapter.Type;
    delete prevChapter.Directory;
  }
  if (nextChapter) {
    nextChapter.chapterNum = getChapterNumber(nextChapter.Chapter);
    delete nextChapter.Chapter;
    delete nextChapter.Type;
    delete nextChapter.Directory;
  }

  if (allChapters.length === 1) return { prevChapter: null, nextChapter: null, ...currentChapter };
  else if (index === 0) return { prevChapter: null, nextChapter, ...currentChapter };
  else if (index === chaptersLength - 1)
    return { prevChapter, nextChapter: null, ...currentChapter };
  else return { prevChapter, nextChapter, ...currentChapter };
};

const getImageURLs = (numOfPages, domain, mangaName, chapterNum) => {
  let images = [];
  for (let i = 0; i < numOfPages; i++) {
    let pageNum = String(i + 1).padStart(3, 0);
    chapterNum = chapterNum.padStart(4, 0);

    let imageUrl = `https://${domain}/manga/${mangaName}/${chapterNum}-${pageNum}.png`;
    images.push(imageUrl);
  }

  return images;
};
