const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cors());

// =======================
// 🔥 STATIC FILES (IMPORTANT FOR REDIRECT)
// =======================
app.use(express.static(path.join(__dirname)));

// =======================
// 🔥 MONGODB
// =======================
mongoose.connect(
  "mongodb+srv://moin91989_db_user:35176504LHR@solar-store.e0xbmce.mongodb.net/solarStore?retryWrites=true&w=majority"
)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("Mongo Error:", err));

// =======================
// 📦 SCHEMAS
// =======================
const OrderSchema = new mongoose.Schema({
  name: String,
  phone: String,
  cart: Array,
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now }
});

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String
});

const AdminSchema = new mongoose.Schema({
  username: String,
  password: String
});

const Order = mongoose.model("Order", OrderSchema);
const Product = mongoose.model("Product", ProductSchema);
const Admin = mongoose.model("Admin", AdminSchema);

// =======================
// 🔐 ADMIN LOGIN
// =======================
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const admin = await Admin.findOne({ username, password });

  if (admin) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

// =======================
// 📦 ORDERS
// =======================
app.post("/order", async (req, res) => {
  const order = new Order(req.body);
  await order.save();
  res.json({ success: true });
});

app.get("/orders", async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

// =======================
// 🛍 PRODUCTS
// =======================
app.get("/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.post("/product", async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.json({ success: true });
});

// =======================
// 🟢 CREATE ADMIN (ONE TIME)
// =======================
app.get("/create-admin", async (req, res) => {
  const admin = new Admin({
    username: "admin",
    password: "1234"
  });

  await admin.save();
  res.send("Admin Created");
});

// =======================
// 🌐 ROOT
// =======================
app.get("/", (req, res) => {
  res.send("Server Running 🚀");
});

// =======================
// 🚀 START
// =======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port", PORT));
