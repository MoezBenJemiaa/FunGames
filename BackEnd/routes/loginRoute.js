const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User"); // Your User mongoose model
const { jwtSecret } = require("../config/keys");

const router = express.Router();

router.post("/", async (req, res) => {// Debugging line
    try {

        const { email, password } = req.body;
        // Check if user already exists
        let user = await User.findOne({ email });

        if (user) {
            // User exists, check password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Invalid password" });
            }
        } else {
            // User does not exist, create new user
            const hashedPassword = await bcrypt.hash(password, 10);
            user = new User({ email, password: hashedPassword });
            await user.save();
        }

        // Create token
        const token = jwt.sign({ id: user._id, email: user.email }, jwtSecret, {
            expiresIn: "7d", // optional
        });

        res.json({ message: "Login successful", token });

    } catch (error) {
        console.error("Auth error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
