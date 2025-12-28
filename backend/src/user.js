const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const upload = require("./upload");


const userSchema = new mongoose.Schema({
    userName: { type: String, required: true,},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    isVerified: { type: Boolean, default: false },
    profilePic: { type: String, default: '' },    
}, { timestamps: true});


userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


const User = mongoose.model('User', userSchema, 'users');


// routes
router.post('/register', async (req, res) => {
    try {
        
        const { userName, email, password } = req.body;

        if (await User.findOne({ email }))
            return res.status(400).json({ message: 'Email already exists' });
        
        const newUser = new User({ userName, email, password });
        await newUser.save();
        
        const token = jwt.sign(
            { id: newUser._id},
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        
        res.cookie("authToken", token, {
            httpOnly: true,       // JS can't read it → safer
            secure: process.env.NODE_ENV === "production",        // true ONLY if HTTPS
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/"
              
        });


        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: 'Invalid email or password' });

        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

        const token = jwt.sign(
            { id: user._id},
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        res.cookie("authToken", token, {
            httpOnly: true,       // JS can't read it → safer
            secure: process.env.NODE_ENV === "production",        // true ONLY if HTTPS
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,  // one week
            path: "/"
        });
        

        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post("/logout", (req, res) => {
  try {
    // Clear the JWT cookie
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true ONLY if HTTPS
      sameSite: "lax",
      path: "/", // make sure it matches the cookie path
    });

    console.log("User logged out successfully.");
    return res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ success: false, message: "Logout failed" });
  }
});

router.get("/check-session", async (req, res) => {
  try {
    const token = req.cookies.authToken;
    if (!token) return res.json({ loggedIn: false });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.json({ loggedIn: false });
    console.log("Session valid for user:", user.userName);

    res.json({ loggedIn: true, user });
  } catch (err) {
    console.error("Session check error:", err);
    res.json({ loggedIn: false });
  }

});

router.post('/change-password/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: 'User not found' });
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Old password is incorrect' });
        user.password = newPassword;
        await user.save();
        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error("Change password error:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/update-user-info/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { userName, email, profilePic } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.userName = userName || user.userName;
        user.email = email || user.email;
        user.profilePic = profilePic || user.profilePic;
        await user.save();
        res.status(200).json({ message: 'User info updated successfully' });
    } catch (error) {
        console.error("Update user info error:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put("/update-profile-pic/:userId", upload.single("profilePic"),async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        user.profilePic = req.file.filename; // assuming 'filename' contains the file name
        const newPic = (await user.save()).profilePic;
        res.status(200).json({ message: 'Profile picture updated successfully', profilePic: newPic });
    } catch (error) {
        console.error("Update profile picture error:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put("/update-user-info/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const { userName, email, profilePic } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        user.userName = userName || user.userName;
        user.email = email || user.email;
        user.profilePic = profilePic || user.profilePic;
        await user.save();
        res.status(200).json({ message: 'User info updated successfully' });
    } catch (error) {
        console.error("Update user info error:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;