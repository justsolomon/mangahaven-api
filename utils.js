exports.baseUrl = "https://weebcentral.com/";

exports.scrapeScript = (root, begin, end) => {
  for (script of root.querySelectorAll("script")) {
    let scriptText = script.rawText;
    let beginIndex = scriptText.indexOf(begin);
    let endIndex;
    if (end) {
      endIndex = scriptText.indexOf(end);
    } else endIndex = scriptText.length;

    let mangaJSON = scriptText
      .slice(beginIndex, endIndex)
      .replace(`${begin} = `, "")
      .replace(/(\r\n|\n|\r|\t)/gm, "")
      .replace(/;/g, "");

    if (mangaJSON !== "") return mangaJSON;
  }
};
