const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// =======================
// MONGO DB
// =======================
const MONGO_URI =
  "mongodb+srv://moin91989_db_user:35176504LHR@solar-store.e0xbmce.mongodb.net/solarStore?retryWrites=true&w=majority";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Mongo Error:", err));

// =======================
// SCHEMAS
// =======================

const OrderSchema = new mongoose.Schema({
  name: String,
  phone: String,
  cart: Array,
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
});

const AdminSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const Order = mongoose.model("Order", OrderSchema);
const Product = mongoose.model("Product", ProductSchema);
const Admin = mongoose.model("Admin", AdminSchema);

// =======================
// ADMIN LOGIN
// =======================

app.post("/create-admin", async (req, res) => {
  try {
    const admin = new Admin({
      username: "admin",
      password: "1234",
    });

    await admin.save();
    res.json({ success: true, message: "Admin created" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const admin = await Admin.findOne({ username, password });

  if (!admin) {
    return res.json({ success: false, message: "Invalid login" });
  }

  res.json({ success: true, message: "Login successful" });
});

// =======================
// PRODUCTS
// =======================

app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.json([]);
  }
});

app.post("/product", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false });
  }
});

// =======================
// ORDERS
// =======================

app.post("/order", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false });
  }
});

app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.json([]);
  }
});

app.put("/order/:id", async (req, res) => {
  try {
    await Order.findByIdAndUpdate(req.params.id, {
      status: req.body.status,
    });
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false });
  }
});

app.delete("/order/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false });
  }
});

// =======================
// ROOT
// =======================

app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// =======================
// START
// =======================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on", PORT));
