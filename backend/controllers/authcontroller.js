const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // ✅ FIX: correct case

const generateToken = (user) => {
  // ✅ include role in token (optional but helpful)
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // ✅ Block admin registration from UI
    if (role === "admin") {
      return res.status(403).json({ message: "Admin registration not allowed" });
    }

    // ✅ allow only user/owner
    const safeRole = role === "owner" ? "owner" : "user";

    // ✅ prevent duplicate email
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: safeRole,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email, // ✅ add email
      role: user.role,
      token: generateToken(user),
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email, // ✅ add email
      role: user.role,   // ✅ owner/admin/user
      token: generateToken(user),
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
