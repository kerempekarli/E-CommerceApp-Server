const express = require("express");
const helmet = require("helmet");
const config = require("./config");
config();
const app = express();
app.use(helmet());
app.use(express.json());

app.listen(3232, () => {
  console.log("3232 Portu üzerinden çalışıyor..");
});
