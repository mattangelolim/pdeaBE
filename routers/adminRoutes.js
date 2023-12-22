const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Admin = require("../models/admin_user")
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/tokenMiddleware")

router.post("/create/admin", verifyToken, async (req, res) => {
    try {
        const { username, password, user_type, district } = req.body;
        const adminCheck = req.user.user_type;
        // console.log(adminCheck)

        // Check if the user making the request is a superadmin
        if (adminCheck !== "superadmin") {
            return res.status(403).json({ error: "Permission denied. Only superadmins can create new admins." });
        }

        // Perform validation 
        if (!username || !password || !user_type || !district) {
            return res.status(400).json({ error: "Missing required fields." });
        }

        // Check if the admin already exists
        const existingAdmin = await Admin.findOne({ 
            where:{
                username:username
            }
        });

        if (existingAdmin) {
            return res.status(409).json({ error: "Admin already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new admin user with the hashed password
        const newAdmin = new Admin({
            username,
            password: hashedPassword,
            user_type,
            district,
        });

        // Save the new admin to the database
        await newAdmin.save();

        // Respond with success message
        res.status(201).json({ message: "Admin created successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.post("/login/admin", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(200).json({ error: "Missing username or password." });
        }

        // Find the admin user in the database
        const admin = await Admin.findOne({ 
            where:{     
                username:username
            }
         });

        // Check if the admin exists
        if (!admin) {
            return res.status(200).json({ error: "Invalid credentials. wrong username" });
        }

        // Compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, admin.password);

        if (!passwordMatch) {
            return res.status(200).json({ error: "Invalid credentials. wrong password" });
        }

        // Create and sign a JWT token
        const token = jwt.sign({ userId: admin.id, username: admin.username, district: admin.district, user_type: admin.user_type}, process.env.SECRETKEY, {
            expiresIn: "8h", // 
        });

        // Respond with the generated token
        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
