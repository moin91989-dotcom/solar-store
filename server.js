const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// 🔥 MongoDB Atlas URL yahan daalna
mongoose.connect("mongodb+srv://moin91989_db_user:<@35176504lhr>@solar-store.e0xbmce.mongodb.net/Solar Store", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Schema
const OrderSchema = new mongoose.Schema({
  name: String,
  phone: String,
  cart: Array,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model("Order", OrderSchema);

// Save order
app.post("/order", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.json({ success: true, message: "Order saved" });
  } catch (err) {
    res.json({ success: false, message: "Error saving order" });
  }
});

// Get orders (admin)
app.get("/orders", async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

// Root check
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running"));