require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 1226;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

async function main() {
  await mongoose.connect(
    "mongodb+srv://abraralvee:ars242423@styleswap.ezzcs5q.mongodb.net/styleswap?retryWrites=true&w=majority&appName=StyleSwap"
  );

  console.log("Mongodb Connected Successfully!");

  app.get("/", (req, res) => {
    res.send("StyleSwap server is running:!");
  });
  app.get("/cloth", (req, res) => {
    res.send("Cloth path is running");
  });

  //routes
  const productRoutes = require("./routes/productRoute");
  const userRoutes = require("./routes/userRoute");
  const cartRoutes = require("./routes/cartRoute");
  const wishlistRoutes = require("./routes/wishlistRoute");
  const adminRoutes = require("./routes/adminRoute");
  app.use("/api/cart", cartRoutes);
  app.use("/api/wishlist", wishlistRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/admin", adminRoutes);

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

main().catch((err) => console.log(err));
