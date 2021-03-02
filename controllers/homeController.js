// const fetch = require("node-fetch");
const rp = require("request-promise");
const { baseUrl, scrapeScript } = require("../utils");
const { parse } = require("node-html-parser");

exports.getAllManga = (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");

  // fetch(`${baseUrl}_search.php`)
  //   .then((res) => res.json())
  //   .then((json) => {
  //     res.send(json);
  //   });

  rp(`${baseUrl}/search`)
    .then((html) => {
      const root = parse(html);
      const allManga = scrapeScript(root, "vm.Directory", "vm.GetIntValue");

      res.send(allManga);
    })
    .catch((err) => console.log(err));
};

exports.getHotManga = (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");

  rp(`${baseUrl}/hot.php`)
    .then((html) => {
      const root = parse(html);
      const hotManga = scrapeScript(root, "vm.HotUpdateJSON", "vm.PageOne");

      res.send(hotManga);
    })
    .catch((err) => console.log(err));
};

exports.getRecentManga = (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");

  rp(baseUrl)
    .then((html) => {
      const root = parse(html);
      const recentManga = scrapeScript(root, "vm.LatestJSON", "vm.NewSeries");

      res.send(recentManga);
    })
    .catch((err) => console.log(err));
};
