const JWT = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];
  try {
    if (token == null) {
      return res
        .status(401)
        .send({ error: "Bu işlemi yapmak için giriş yapmalısınız" });
    }
    JWT.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, user) => {
      console.log("User: ", user);
      if (err) {
        console.log(err);
        console.log("Authenticate işlemi yapılamadı");
        return res.status(403).send({ error: "Token süresi geçmiş" });
      }
      req.user = user;
      next();
    });
  } catch (err) {
    console.log(err);
    console.log("Authenticate işlemi yapılamadı");
  }
};

module.exports = { authenticateToken };
