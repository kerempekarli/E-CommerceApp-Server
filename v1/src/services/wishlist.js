const db = require("../loaders/db");

class WishListService {
  constructor() {
    this.wishlist = null;
  }
  async getOrCreateWishListService(userId) {
    if (!this.wishlist) {
      const query = "SELECT id FROM wishlists WHERE user_id = $1";
      const values = [userId];
      const result = await db.query(query, values);
      if (result.rows.length > 0) {
        this.wishlist = result.rows[0];
      } else {
        const createQuery =
          "INSERT INTO wishlists (user_id) VALUES ($1) RETURNING id";
        const createValues = [userId];
        const createResult = await db.query(createQuery, createValues);
        this.wishlist = createResult.rows[0];
      }
    }
    return this.wishlist;
  }
  async addToWishListService(wishListId, productId) {
    try {
      // İstek listesi ve ürünü eklemek için SQL sorgusu
      const query =
        "INSERT INTO wishlist_items (wishlist_id, product_id) VALUES ($1, $2)";
      const values = [wishListId, productId];

      // PostgreSQL bağlantısını kullanarak sorguyu çalıştır
      await db.query(query, values);
      return "Ekleme işlemi başarılı";
    } catch (error) {
      console.error("İstek listesine ürün eklenirken bir hata oluştu:", error);
      return "Ekleme işlemi başarısız";
    }
  }
  async deleteWishListItemService(wishListId, productId) {
    try {
      const query =
        "DELETE FROM wishlist_items WHERE wishlist_id = $1 AND product_id = $2";
      const values = [wishListId, productId];
      await db.query(query, values);
      return "Silme işlemi başarılı";
    } catch (error) {
      console.error(
        "İstek listesinden ürün silinirken bir hata oluştu:",
        error
      );
      return "Silme işlemi başarısız";
    }
  }
  async getWishListItemsService(userId) {
    const wishList = await this.getOrCreateWishListService(userId);
    const query = `
    SELECT wi.id AS wishlist_item_id, p.id as product_id, p.*
    FROM wishlist_items wi
    INNER JOIN products p ON wi.product_id = p.id
    WHERE wi.wishlist_id = $1;
    `;
    const values = [wishList.id];
    const result = await db.query(query, values);
    return result.rows;
  }
  async isAdded(productId, wishlistId) {
    const query =
      "SELECT COUNT(*) FROM wishlist_items WHERE product_id = $1 AND wishlist_id = $2";
    const values = [productId, wishlistId];
    const result = await db.query(query, values);

    return result.rows[0].count > 0;
  }
}

// Singleton örneğini oluştur
const wishListService = new WishListService();

// Diğer dosyalardan kullanılabilmesi için export et
module.exports = wishListService;
