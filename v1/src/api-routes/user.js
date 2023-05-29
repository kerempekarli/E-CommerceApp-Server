const express = require("express");
const validate = require("../middlewares/validate");
const schemas = require("../validations/user");
const { authenticateToken } = require("../middlewares/authenticate");
const {
  createUser,
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
  loginUser,
  addUserPhoto,
} = require("../controllers/user");
const { storage } = require("../scripts/utils/fileHelper");
const multer = require("multer");
const uploadFile = multer({ storage: storage });

const router = express.Router();
router.route("/").get(authenticateToken, getAllUsers);
router.route("/").post(validate(schemas.createValidation), createUser);
router.put("/", updateUser);
router.post("/login", loginUser);
router.get("/:id", getUser);
router.delete("/:id", deleteUser);
router
  .route("/:id/add-user-photo")
  .patch(uploadFile.single("photo"), addUserPhoto);

module.exports = router;
