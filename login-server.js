const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ======= MONGODB CONNECTION =======
mongoose.connect(
  "mongodb+srv://truzone:0U4bRfUJPvdBJhS7@cluster0.tutojxn.mongodb.net/signup?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => console.log("MongoDB connected for login"))
.catch(err => console.error("MongoDB connection error:", err));

// ======= USER SCHEMA =======
const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: { type: String, unique: true },
  password: String,
  ip_address: String,
  device_name: String,
  created_at: { type: Date, default: Date.now }
});
const User = mongoose.model("User", userSchema);

// ======= LOGIN ROUTE =======
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "Email not registered" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.json({ success: false, message: "Incorrect password" });
    }

    // Optional: Generate a simple token or session ID
    const token = `${user._id}_${Date.now()}`;

    res.json({ success: true, message: "Login successful", token });
  } catch (err) {
    console.error("Login error:", err);
    res.json({ success: false, message: "Server error, try again later" });
  }
});

// ======= START SERVER =======
const PORT = process.env.PORT || 10001;
app.listen(PORT, () => console.log(`Login backend running on port ${PORT}`));