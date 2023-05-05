const Joi = require("joi");

const createValidation = Joi.object({
  first_name: Joi.string().required().min(3),
  last_name: Joi.string().required().min(3),
  email: Joi.string().required().min(3),
  username: Joi.string().required().min(3),
  password: Joi.string().required().min(3).max(10),
});
module.exports = { createValidation };
