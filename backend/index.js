




const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "secret_ecom";

// ================= MIDDLEWARE =================

app.use(express.json());
app.use(cors());

// ================= DATABASE CONNECTION =================

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// ================= API TEST =================

app.get("/", (req, res) => {
  res.send("Express App is Running");
});

// ================= IMAGE STORAGE ENGINE =================

const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extOk = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeOk = allowedTypes.test(file.mimetype);
  if (extOk && mimeOk) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// ================= STATIC FOLDER =================

app.use("/images", express.static("upload/images"));

// ================= IMAGE UPLOAD API =================

app.post("/upload", upload.single("product"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }
  res.json({
    success: 1,
    image_url: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
  });
});

// ================= PRODUCT SCHEMA =================

const Product = mongoose.model("Product", {
  id: { type: Number, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  new_price: { type: Number, required: true },
  old_price: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true },
});

// ================= ADD PRODUCT API =================

app.post("/addproduct", async (req, res) => {
  try {
    const { name, image, category, new_price, old_price } = req.body;

    if (!name || !image || !category || !new_price || !old_price) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    let products = await Product.find({});
    const id = products.length > 0 ? products[products.length - 1].id + 1 : 1;

    const product = new Product({ id, name, image, category, new_price, old_price });
    await product.save();

    console.log("Product Saved:", name);
    res.json({ success: true, name });
  } catch (error) {
    console.error("Add product error:", error);
    res.status(500).json({ success: false, message: "Error adding product" });
  }
});

// ================= REMOVE PRODUCT API =================

app.post("/removeproduct", async (req, res) => {
  try {
    if (!req.body.id) {
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }

    const deleted = await Product.findOneAndDelete({ id: req.body.id });

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    console.log("Product Removed:", req.body.id);
    res.json({ success: true, message: "Product Removed Successfully" });
  } catch (error) {
    console.error("Remove product error:", error);
    res.status(500).json({ success: false, message: "Error removing product" });
  }
});

// ================= ALL PRODUCTS API =================

app.get("/allproducts", async (req, res) => {
  try {
    const products = await Product.find({});
    console.log("All Products Fetched");
    res.json(products);
  } catch (error) {
    console.error("Fetch products error:", error);
    res.status(500).json({ success: false, message: "Error fetching products" });
  }
});

// ================= NEW COLLECTIONS API =================

app.get("/newcollections", async (req, res) => {
  try {
    const products = await Product.find({});
    const newcollection = products.slice(1).slice(-8);
    console.log("NewCollection Fetched");
    res.json(newcollection);
  } catch (error) {
    console.error("New collections error:", error);
    res.status(500).json({ success: false, message: "Error fetching new collections" });
  }
});

// ================= POPULAR IN WOMEN API =================

app.get("/popularinwomen", async (req, res) => {
  try {
    const products = await Product.find({ category: "women" });
    const popular_in_women = products.slice(0, 4);
    console.log("Popular in women fetched");
    res.json(popular_in_women);
  } catch (error) {
    console.error("Popular in women error:", error);
    res.status(500).json({ success: false, message: "Error fetching popular products" });
  }
});

// ================= USER SCHEMA =================

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  cartData: { type: Map, of: Number, default: {} },  // FIX: Map type for proper tracking
  date: { type: Date, default: Date.now },
});

const Users = mongoose.model("User", UserSchema);

// ================= AUTH MIDDLEWARE =================

const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).json({ success: false, errors: "Access denied. No token provided." });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, errors: "Invalid or expired token" });
  }
};

// ================= SIGNUP API =================

app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, errors: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, errors: "Password must be at least 6 characters" });
    }

    const check = await Users.findOne({ email });
    if (check) {
      return res.status(400).json({ success: false, errors: "User already exists with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // FIX: Initialize cart as plain object for Map type
    let cart = {};
    for (let i = 0; i < 300; i++) cart[i] = 0;

    const user = new Users({
      name: username,
      email,
      password: hashedPassword,
      cartData: cart,
    });

    await user.save();

    const token = jwt.sign({ user: { id: user.id } }, JWT_SECRET, { expiresIn: "7d" });

    res.json({ success: true, token });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ success: false, message: "Signup failed" });
  }
});

// ================= LOGIN API =================

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, errors: "Email and password are required" });
    }

    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, errors: "Invalid email or password" });
    }

    const passCompare = await bcrypt.compare(password, user.password);
    if (!passCompare) {
      return res.status(400).json({ success: false, errors: "Invalid email or password" });
    }

    const token = jwt.sign({ user: { id: user.id } }, JWT_SECRET, { expiresIn: "7d" });

    res.json({ success: true, token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Login failed" });
  }
});

// ================= ADD TO CART API =================

app.post("/addtocart", fetchUser, async (req, res) => {
  try {
    const { itemId } = req.body;
    if (itemId === undefined) {
      return res.status(400).json({ success: false, message: "Item ID is required" });
    }

    const userData = await Users.findById(req.user.id);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // FIX: markModified + save() to properly persist nested object changes
    const key = String(itemId);
    userData.cartData[key] = (userData.cartData[key] || 0) + 1;
    userData.markModified("cartData");
    await userData.save();

    console.log(`Item ${itemId} added to cart for user ${req.user.id}`);
    res.json({ success: true, message: "Added to cart" });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ success: false, message: "Error adding to cart" });
  }
});

// ================= ADD CART ALIAS (for frontend compatibility) =================

app.post("/addcart", fetchUser, async (req, res) => {
  try {
    const { itemId } = req.body;
    if (itemId === undefined) {
      return res.status(400).json({ success: false, message: "Item ID is required" });
    }

    const userData = await Users.findById(req.user.id);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const key = String(itemId);
    userData.cartData[key] = (userData.cartData[key] || 0) + 1;
    userData.markModified("cartData");
    await userData.save();

    console.log(`Item ${itemId} added to cart for user ${req.user.id}`);
    res.json({ success: true, message: "Added to cart" });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ success: false, message: "Error adding to cart" });
  }
});

// ================= REMOVE FROM CART API =================

app.post("/removefromcart", fetchUser, async (req, res) => {
  try {
    const { itemId } = req.body;
    if (itemId === undefined) {
      return res.status(400).json({ success: false, message: "Item ID is required" });
    }

    const userData = await Users.findById(req.user.id);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // FIX: markModified + save()
    const key = String(itemId);
    if (userData.cartData[key] > 0) {
      userData.cartData[key] -= 1;
    }
    userData.markModified("cartData");
    await userData.save();

    console.log(`Item ${itemId} removed from cart for user ${req.user.id}`);
    res.json({ success: true, message: "Removed from cart" });
  } catch (error) {
    console.error("Remove from cart error:", error);
    res.status(500).json({ success: false, message: "Error removing from cart" });
  }
});

// ================= GET CART DATA API =================

app.post("/getcart", fetchUser, async (req, res) => {
  try {
    const userData = await Users.findById(req.user.id);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    console.log(`Cart fetched for user ${req.user.id}`);
    res.json({ success: true, cartData: userData.cartData });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ success: false, message: "Error fetching cart" });
  }
});

// ================= GLOBAL ERROR HANDLER =================

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: err.message || "Internal server error" });
});

// ================= SERVER =================

app.listen(port, () => {
  console.log(`Server Running on port ${port}`);
});