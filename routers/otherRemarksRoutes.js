const express = require("express");
const router = express.Router();
const multer = require("multer");
const verifyToken = require("../middleware/tokenMiddleware");
const { generateRandomString } = require("../utils/generatedIDS")
const Gallery = require("../models/Gallery");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/evidences/"); // Set the destination folder for uploaded images
    },
    filename: function (req, file, cb) {
        const uniqueFileName = generateRandomString(); // Generate a unique filename
        cb(null, uniqueFileName + "_" + Date.now() + ".jpg"); // Append a timestamp to the filename
    },
});

const upload = multer({ storage });

router.post("/upload/gallery", upload.single("file"), verifyToken, async (req, res) => {

    try {
        const adminChecker = req.user;

        if (
            adminChecker.user_type === "superadmin" ||
            adminChecker.user_type === "admin"
        ) {

            const UID = req.query.UID
            const description = req.body.description
            const file = req.file

            const uploadEvidence = await Gallery.create({
                UID,
                Gallery: file.path,
                description
            })

            res.status(201).json({ uploadEvidence })
        } else {
            res.status(403).json({
                error:
                    "Permission denied. Only superadmins or admins can register drug personalities.",
            });
        }

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: error.message })
    }

})

router.get("/person/gallery", async (req, res) => {
    try {
      const UID = req.query.UID;
  
      // Assuming 'Gallery' is your model and you want to find galleries by UID
      const galleries = await Gallery.findAll({ 
        where:{
            UID:UID
        }
       });
  
      if (!galleries || galleries.length === 0) {
        return res.status(210).json({ message: "Galleries not found for this UID" });
      }
  
      res.status(200).json({ galleries });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router