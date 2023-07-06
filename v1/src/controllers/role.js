const returnRole = (req, res) => {
  const { role_name } = req.user;

  res.status(200).send({ role_name: role_name });
};

module.exports = { returnRole };
