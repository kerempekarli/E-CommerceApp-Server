const { create, getAll, get, update, remove } = require("../services/category");

// Kategori oluşturma (CREATE)
const createCategory = async (req, res) => {
  const result = await create(req, res);
  res.status(200).send("Sonuç");
};

// Tüm kategorileri alma (READ all)
const getAllCategories = async (req, res) => {
  const result = await getAll();
  return res.status(200).send(result);
};

// Tek bir kategori alma (READ one)
const getCategoryById = async (req, res) => {
  const result = await get(req, res);
  return res.status(200).send(result);
};

// Kategori güncelleme (UPDATE)
const updateCategory = async (req, res) => {
  const id = req.params.id;
  const name = req.body.name;

  const result = await update(id, name);
  res.status(200).send({ message: "Başarıyla güncellendi", result: result });
};

// Kategori silme (DELETE)
const deleteCategory = async (req, res) => {
  const result = await remove(req, res);
  res.status(203).send("Başarıyla silindi");
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
