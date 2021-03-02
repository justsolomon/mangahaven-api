exports.baseUrl = "https://manga4life.com/";

exports.scrapeScript = (root, begin, end) => {
  for (script of root.querySelectorAll("script")) {
    let scriptText = script.rawText;
    let beginIndex = scriptText.indexOf(begin);
    let endIndex = scriptText.indexOf(end);
    let mangaJSON = scriptText
      .slice(beginIndex, endIndex)
      .replace(`${begin} = `, "")
      .replace(/(\r\n|\n|\r|\t)/gm, "")
      .replace(/;/g, "");

    if (mangaJSON !== "") return mangaJSON;
  }
};
