const returnRole = (req, res) => {
  const { rol_adı } = req.user;

  res.status(200).send({ role_name: rol_adı });
};

module.exports = { returnRole };
