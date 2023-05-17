const express = require("express");
const helmet = require("helmet");
const config = require("./config");
const events = require("./scripts/events");
const {
  userRoutes,
  accountsRoutes,
  sellerRoutes,
  productRoutes,
  categoryRoutes,
} = require("./api-routes");
config();
events();
const app = express();
app.use(helmet());
app.use(express.json());
app.use(express.static("uploads/"));
app.listen(3232, () => {
  console.log("3232 Portu üzerinden çalışıyor.");
  app.use("/users", userRoutes);
  app.use("/sellers", sellerRoutes);
  app.use("/accounts", accountsRoutes);
  app.use("/products", productRoutes);
  app.use("/categories", categoryRoutes);
});
