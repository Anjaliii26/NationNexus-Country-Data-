const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Register User
router.post("/register", async (req, res) => {
    try {
      const { username, email, password } = req.body;
    // console.log("Received Registration Request:", req.body); // Log input data
  
      const existingUser = await User.findOne({ email });
    // console.log("Existing User Found:", existingUser); // Log if user exists
  
      if (existingUser) {
        return res.status(400).json({ error: "Email already exists!" });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();
  
      res.status(201).json("User registered successfully");
    } catch (err) {
      console.error("Error in Registration:", err);
      res.status(500).json(err);
    }
  });
  
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials!" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});
 //for profile

 router.get("/profile", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");
        if (!user) return res.status(404).json({ error: "User not found" });
  
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  });


  router.post("/favourite/add/:itemId", authMiddleware, async (req, res) => {
    try {
      const user = await User.findById(req.user.userId);
      const itemId = req.params.itemId;
  
      if (!user.favourite.includes(itemId)) {
        user.favourite.push(itemId);
        await user.save();
      }
  
      res.json({ message: "Item added to favourites", favourite: user.favourite });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });
  

  router.delete("/favourite/remove/:itemId", authMiddleware, async (req, res) => {
    try {
      const user = await User.findById(req.user.userId);
      const itemId = req.params.itemId;
  
      user.favourite = user.favourite.filter((fav) => fav.toString() !== itemId);
      await user.save();
  
      res.json({ message: "Item removed from favourites", favourite: user.favourite });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });


  router.get("/favourite", authMiddleware, async (req, res) => {
    try {
      const user = await User.findById(req.user.userId).populate("favourite"); // Populate item details
      res.json(user.favourite);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });
  
  
module.exports = router;
