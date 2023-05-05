const {
  insert,
  getAll,
  getById,
  remove,
  update,
  login,
} = require("../services/seller");
const logger = require("../scripts/logger/user");
const {
  passwordToHash,
  generateAccessToken,
  generateRefreshToken,
} = require("../scripts/utils/helper");
const registerSeller = (req, res) => {
  req.body.password = passwordToHash(req.body.password);
  console.log(req.body.password);
  insert(req.body)
    .then((response) => {
      res.status(200).send({ message: "Kayıt başarılı", data: response });
      logger.log({
        level: "info",
        message: "Ekleme işlemi başarılı",
        data: req.body,
      });
    })
    .catch((err) => {
      res.status(400).send({ message: "Kayıt başarısız", error: err });
      logger.log({
        level: "error",
        message: "Ekleme işlemi başarısız",
        data: req.body,
      });
    });
};
const getAllSellers = (req, res) => {
  getAll(req)
    .then((response) => res.status(200).send({ Sellers: response.rows }))
    .catch((err) =>
      res
        .status(500)
        .send({ message: "Kayıtları getirme işlemi başarısız", error: err })
    );
};

const getSeller = (req, res) => {
  console.log(req.params);
  getById(req.params.id)
    .then((response) => res.status(200).send({ Seller: response.rows[0] }))
    .catch((err) =>
      res
        .status(500)
        .send({ message: "Kullanıcıyı getirme işlemi başarısız", error: err })
    );
};
const deleteSeller = (req, res) => {
  remove(req)
    .then((response) =>
      res.status(200).send({ message: "Kullanıcı başarıyla silindi" })
    )
    .catch((err) =>
      res
        .status(500)
        .send({ message: "Kullanıcıyı silme işlemi başarısız", error: err })
    );
};
const updateSeller = (req, res) => {
  console.log("req ", req);
  update(req)
    .then((response) =>
      res
        .status(200)
        .send({ message: "Satıcı başarıyla güncellendi", data: response })
    )
    .catch((err) =>
      res.status(500).send({
        message: "Satıcı bilgilerini güncelleme işlemi başarısız",
        error: err,
      })
    );
};
const loginSeller = (req, res) => {
  req.body.password = passwordToHash(req.body.password);
  login(req.body)
    .then((response) => {
      if (response.rowCount > 0) {
        console.log(response.rows[0]);
        const Seller = {
          ...response.rows[0],

          tokens: {
            access_token: generateAccessToken(response.rows[0]),
            refresh_token: generateRefreshToken(response.rows[0]),
          },
        };
        delete Seller.password;
        res.status(200).send(Seller);
      } else {
        res.status(400).send({ message: "Yanlış parola yada email" });
      }
    })
    .catch((err) => res.status(400).send(err));
};

module.exports = {
  registerSeller,
  getAllSellers,
  getSeller,
  deleteSeller,
  updateSeller,
  loginSeller,
};
