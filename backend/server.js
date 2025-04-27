const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); 

const app = express();
const port = process.env.PORT || 1226;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

async function main() {
  await mongoose.connect(
    process.env.MONGODB_URI || "mongodb+srv://abraralvee:ars242423@styleswap.ezzcs5q.mongodb.net/styleswap?retryWrites=true&w=majority&appName=StyleSwap"
  );

  console.log("Mongodb Connected Successfully!");

  // Routes
  const productRoutes = require("./routes/productRoute");
  const userRoutes = require("./routes/userRoute");
  const cartRoutes = require("./routes/cartRoute");
  const wishlistRoutes = require("./routes/wishlistRoute");
  const orderRoutes = require('./routes/orderRoute');
  const exchangeRoutes = require('./routes/exchangeRoute');
  const paymentRoutes = require('./routes/paymentRoute');

  app.use('/api/orders', orderRoutes);
  app.use("/api/cart", cartRoutes);
  app.use("/api/wishlist", wishlistRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/products", productRoutes);
  app.use('/api/payments', paymentRoutes);
  app.use('/api/exchanges', exchangeRoutes);

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

main().catch((err) => console.error("Server error:", err));
