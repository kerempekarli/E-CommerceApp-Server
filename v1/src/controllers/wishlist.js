const wishListService = require("../services/wishlist");

const getWishListItems = async (req, res) => {
  try {
    const result = await wishListService.getWishListItemsService(req.user.id);
    res.status(200).send(result);
  } catch (err) {
    res.status(400).send(err);
  }
};
const addItem = async (req, res) => {
  try {
    const wishList = await wishListService.getOrCreateWishListService(
      req.user.id
    );

    const product_id = req.body.product_id;
    const logic = await wishListService.isAdded(product_id, wishList.id);
    if (logic == false) {
      const result = await wishListService.addToWishListService(
        wishList.id,
        product_id
      );
      res.status(200).send(result);
    } else {
      res.status(400).send("Ürün zaten istek listenizde ekli");
    }
  } catch (error) {
    res.status(400).send(error);
  }
};
const deleteCartItem = async (req, res) => {
  try {
    const product_id = req.body.product_id;
    const wishList = await wishListService.getOrCreateWishListService(
      req.user.id
    );
    const logic = await wishListService.isAdded(product_id, wishList.id);
    if (logic == true) {
      const result = await wishListService.deleteWishListItemService(
        wishList.id,
        product_id
      );
      res.status(200).send(result);
    } else {
      res.status(400).send("Ürün zaten istek listenizde ekli değil.");
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = {
  getWishListItems,
  addItem,
  deleteCartItem,
};
