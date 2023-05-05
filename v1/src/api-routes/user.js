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
} = require("../controllers/user");

const router = express.Router();
router.route("/").get(authenticateToken, getAllUsers);
router.route("/").post(validate(schemas.createValidation), createUser);
router.put("/", updateUser);
router.post("/login", loginUser);
router.get("/:id", getUser);
router.delete("/:id", deleteUser);

module.exports = router;
