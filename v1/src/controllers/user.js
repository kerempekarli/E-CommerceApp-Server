const {
  insert,
  getAll,
  getById,
  remove,
  update,
  login,
  addUserPhotoService,
} = require("../services/user");
const logger = require("../scripts/logger/user");
const {
  passwordToHash,
  generateAccessToken,
  generateRefreshToken,
} = require("../scripts/utils/helper");
const { imageToBase64 } = require("../scripts/utils/fileHelper");
const createUser = (req, res) => {
  req.body.password = passwordToHash(req.body.password);
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
const getAllUsers = (req, res) => {
  getAll(req)
    .then((response) => res.status(200).send({ Users: response.rows }))
    .catch((err) =>
      res
        .status(500)
        .send({ message: "Kayıtları getirme işlemi başarısız", error: err })
    );
};

const getUser = async (req, res) => {
  const data = await getById(req.params.id);
  const imagePath = "uploads/" + data.rows[0].user_image;
  const photo64 = await imageToBase64(imagePath);

  res.status(200).send({ user: { ...data.rows[0], user_image: photo64 } });
};
const deleteUser = (req, res) => {
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
const updateUser = (req, res) => {
  update(req)
    .then((response) =>
      res
        .status(200)
        .send({ message: "Kullanıcı başarıyla güncellendi", data: response })
    )
    .catch((err) =>
      res.status(500).send({
        message: "Kullanıcı bilgilerini güncelleme işlemi başarısız",
        error: err,
      })
    );
};
const loginUser = (req, res) => {
  req.body.password = passwordToHash(req.body.password);
  login(req.body)
    .then((response) => {
      if (response.rowCount > 0) {
        const user = {
          ...response.rows[0],

          tokens: {
            access_token: generateAccessToken(response.rows[0]),
            refresh_token: generateRefreshToken(response.rows[0]),
          },
        };
        delete user.password;
        res.status(200).send(user);
      } else {
        res.status(400).send({ message: "Yanlış parola yada email" });
      }
    })
    .catch((err) => res.status(400).send(err));
};
const addUserPhoto = async (req, res) => {
  const result = await addUserPhotoService(req.file.filename, req.params.id);
  res.status(200).send("Fotoğraf başarıyla eklendi.");
};

module.exports = {
  addUserPhoto,
  createUser,
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
  loginUser,
};
