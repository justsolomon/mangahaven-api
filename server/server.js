const express = require("express");
const serverless = require("serverless-http");
const routes = require("../routes");

const app = express();

app.use("/.netlify/functions/server", routes);

app.listen(process.env.PORT || 3000, function () {
  console.log(
    `Server listening on port ${this.address().port} in ${
      app.settings.env
    } mode`
  );
});

module.exports.handler = serverless(app);