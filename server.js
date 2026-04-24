const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// =======================
// 🔥 MIDDLEWARE
// =======================
app.use(express.json());
app.use(cors());

// ⭐ IMPORTANT: STATIC FILES (FIXES YOUR REDIRECT ISSUE)
app.use(express.static(path.join(__dirname)));

// =======================
// 🔥 MONGO DB
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

// =======================
// 📦 MODELS
// =======================
const Order = mongoose.model("Order", OrderSchema);
const Product = mongoose.model("Product", ProductSchema);
const Admin = mongoose.model("Admin", AdminSchema);

// =======================
// 🔐 LOGIN API
// =======================
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username, password });

    if (admin) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }

  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// =======================
// 📦 ORDERS
// =======================
app.post("/order", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json([]);
  }
});

// =======================
// 🛍 PRODUCTS
// =======================
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json([]);
  }
});

app.post("/product", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// =======================
// 🟢 CREATE ADMIN (ONE TIME USE)
// =======================
app.get("/create-admin", async (req, res) => {
  try {
    const exists = await Admin.findOne({ username: "admin" });

    if (exists) {
      return res.send("Admin already exists");
    }

    const admin = new Admin({
      username: "admin",
      password: "1234"
    });

    await admin.save();
    res.send("Admin Created Successfully");
  } catch (err) {
    res.status(500).send("Error creating admin");
  }
});

// =======================
// 🌐 ROOT
// =======================
app.get("/", (req, res) => {
  res.send("Server Running 🚀");
});

// =======================
// 🚀 START SERVER
// =======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port", PORT));
