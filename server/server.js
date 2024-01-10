const express = require("express");
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
