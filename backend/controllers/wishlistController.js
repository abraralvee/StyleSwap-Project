const Wishlist = require("../models/wishlist");

const addToWishlist = async (req, res) => {
  const { userId, productId } = req.body;
  try {
    let wishlist = await Wishlist.findOne({ userId });

    if (wishlist) {
      const exists = wishlist.items.some((item) => item.productId == productId);
      if (!exists) wishlist.items.push({ productId });
      await wishlist.save();
    } else {
      wishlist = new Wishlist({ userId, items: [{ productId }] });
      await wishlist.save();
    }

    res.status(200).json({ success: true, message: "Added to wishlist", wishlist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getWishlist = async (req, res) => {
  const { userId } = req.params;
  try {
    const wishlist = await Wishlist.findOne({ userId }).populate("items.productId");
    res.status(200).json({ success: true, wishlist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { addToWishlist, getWishlist };
