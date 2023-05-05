const express = require("express");
const helmet = require("helmet");
const config = require("./config");
const { userRoutes, productRoutes, sellerRoutes } = require("./api-routes");
config();
const app = express();
app.use(helmet());
app.use(express.json());

app.listen(3232, () => {
  console.log("3232 Portu üzerinden çalışıyor.");
  app.use("/users", userRoutes);
  app.use("/sellers", sellerRoutes);
});
