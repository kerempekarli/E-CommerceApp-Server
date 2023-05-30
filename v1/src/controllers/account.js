const { reset } = require("../services/account");
const eventEmitter = require("../scripts/events/eventEmitter");
const JWT = require("jsonwebtoken");
const { passwordToHash } = require("../scripts/utils/helper");
const db = require("../loaders/db");
const forgotPassword = (req, res) => {
  const user = reset(req.body.email);
  user.then((data) => {
    if (data.rows[0] == null) {
      res.status(400).send("Bu emaile kayıtlı bir hesap bulunmamaktadır");
    } else {
      const resetToken = JWT.sign(
        { id: data.rows[0].id },
        process.env.ACCESS_TOKEN_SECRET_KEY,
        {
          expiresIn: "1h",
        }
      );
      const emailData = {
        to: req.body.email,
        text: `http://localhost:3232/accounts/reset-password/${resetToken}`,
        subject: "Reset password",
      };
      eventEmitter.emit("send_email", emailData);
      res
        .status(200)
        .send("Şifre sıfırlama linki kayıtlı emailinize gönderildi.");
    }
  });
};
const resetPassword = (req, res) => {
  try {
    // Yeni şifreyi alın
    const { password } = req.body;

    // JWT'den kullanıcı kimliğini alın
    const decoded = JWT.verify(
      req.params.token,
      process.env.ACCESS_TOKEN_SECRET_KEY
    );
    const userId = decoded.id;

    // Yeni şifreyi hashleyin ve veritabanında güncelleyin
    const hashedPassword = passwordToHash(password);
    db.query("UPDATE users SET password = $1 WHERE id = $2", [
      hashedPassword,
      userId,
    ]);

    return res
      .status(200)
      .json({ message: "Şifreniz başarıyla değiştirildi." });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(400).json({ message: "Token süresi dolmuş." });
    } else if (err.name === "JsonWebTokenError") {
      return res.status(400).json({ message: "Geçersiz token." });
    } else {
      console.error(err);
      return res.status(500).json({ message: "Bir hata oluştu." });
    }
  }
};

module.exports = {
  forgotPassword,
  resetPassword,
};
