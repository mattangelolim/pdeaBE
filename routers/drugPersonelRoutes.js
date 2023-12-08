const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/tokenMiddleware");
const DrugPerson = require("../models/drug_personality");
const multer = require("multer");
const {
  generateAffiliationID,
  generateVehicleID,
  generateBankID,
  generateRandomString,
} = require("../utils/generatedIDS");

// Set up multer storage to store files in a folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/profiles/"); // Set the destination folder for uploaded images
  },
  filename: function (req, file, cb) {
    const uniqueFileName = generateRandomString(); // Generate a unique filename
    cb(null, uniqueFileName + "_" + Date.now() + ".jpg"); // Append a timestamp to the filename
  },
});

const upload = multer({ storage });

// Endpoint to upload a picture
router.post("/upload-picture", upload.single("file"), async (req, res) => {
  try {
    const uid = req.query.uid;

    // Check if the user with the given UID exists
    const user = await DrugPerson.findOne({ where: { UID: uid } });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No picture file uploaded." });
    }

    // Update the user's profile with the uploaded picture path
    user.file = req.file.path;
    await user.save();

    res.status(200).json({
      message: "Picture uploaded successfully.",
      imagePath: user.Picture,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.post(
  "/register/drug-personality",
  upload.single("file"),
  verifyToken,
  async (req, res) => {
    try {
      const adminChecker = req.user;

      const UID = generateRandomString();
      console.log(UID);

      if (
        adminChecker.user_type === "superadmin" ||
        adminChecker.user_type === "admin"
      ) {
        const {
          First_Name,
          Middle_Name,
          Last_Name,
          Birthdate,
          Address,
          Barangay,
          City,
          Region,
          Gender,
          Civil_Status,
          Nationality,
          Classification,
          Classification_Rating,
        } = req.body;

        // FUNCTIONS TO GENERATE DIFFERENT IDS
        const Affiliation_id = generateAffiliationID(UID);
        const Vehicle_id = generateVehicleID(UID);
        const Bank_id = generateBankID(UID);
        const file = req.file;

        // Find the drug personality by UID
        const drugPersonality = await DrugPerson.findOne({
          where: {
            First_Name: First_Name,
            Middle_Name: Middle_Name,
            Last_Name: Last_Name,
            Birthdate: Birthdate,
          },
        });

        // If the drug personality doesn't exist, create a new one
        if (!drugPersonality) {
          const DrugPersonnel = await DrugPerson.create({
            UID,
            district: adminChecker.district,
            First_Name,
            Middle_Name,
            Last_Name,
            Birthdate,
            Address,
            Barangay,
            City,
            Region,
            Gender,
            Civil_Status,
            Nationality,
            Classification,
            Classification_Rating,
            Picture: file.path,
            Affiliation_id,
            Vehicle_id,
            Bank_id,
          });
          res.status(201).json({
            message: "Drug personality created successfully.",
            DrugPersonnel,
          });
        } else {
          res.status(400).json({ message: "Drug Personality already exist" });
        }
      } else {
        res.status(403).json({
          error:
            "Permission denied. Only superadmins or admins can register drug personalities.",
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }
);

router.get("/personal/information", async (req, res) => {
  try {
    const UID = req.query.UID;

    const personalInfo = await DrugPerson.findOne({
      where: {
        UID: UID,
      },
    });

    if (!personalInfo) {
      return res.status(404).json({ message: "No personal details found" });
    }

    res
      .status(200)
      .json({ personalInfo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.post("/update/drug-personality", verifyToken, async (req, res) => {
  try {
    const adminChecker = req.user;
    const UID = req.query.UID;

    if (
      adminChecker.user_type === "superadmin" ||
      adminChecker.user_type === "admin"
    ) {
      const {
        First_Name,
        Middle_Name,
        Last_Name,
        Birthdate,
        Address,
        Barangay,
        City,
        Region,
        Gender,
        Civil_Status,
        Nationality,
        Classification,
        Classification_Rating,
      } = req.body;

      // Check if the UID is provided in the request body
      if (!UID) {
        return res
          .status(400)
          .json({ error: "UID is required for updating drug personality." });
      }

      // Find the drug personality by UID
      const drugPersonality = await DrugPerson.findOne({
        where: { UID },
      });

      // If the drug personality doesn't exist, return an error
      if (!drugPersonality) {
        return res.status(404).json({ error: "Drug personality not found." });
      }

      // Update fields only if they are provided in the request body
      if (First_Name) drugPersonality.First_Name = First_Name;
      if (Middle_Name) drugPersonality.Middle_Name = Middle_Name;
      if (Last_Name) drugPersonality.Last_Name = Last_Name;
      if (Birthdate) drugPersonality.Birthdate = Birthdate;
      if (Address) drugPersonality.Address = Address;
      if (Barangay) drugPersonality.Barangay = Barangay;
      if (City) drugPersonality.City = City;
      if (Region) drugPersonality.Region = Region;
      if (Gender) drugPersonality.Gender = Gender;
      if (Civil_Status) drugPersonality.Civil_Status = Civil_Status;
      if (Nationality) drugPersonality.Nationality = Nationality;
      if (Classification) drugPersonality.Classification = Classification;
      if (Classification_Rating)
        drugPersonality.Classification_Rating = Classification_Rating;

      // Save the updated drug personality
      await drugPersonality.save();

      res.status(200).json({
        message: "Drug personality updated successfully.",
        drugPersonality,
      });
    } else {
      res.status(403).json({
        error:
          "Permission denied. Only superadmins or admins can update drug personalities.",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.post("/delete/drug-personality", verifyToken, async (req, res) => {
  try {
    const adminChecker = req.user;

    if (
      adminChecker.user_type === "superadmin" ||
      adminChecker.user_type === "admin"
    ) {
      const UID = req.query.UID;

      // Find the drug personality by UID
      const drugPersonality = await DrugPerson.findOne({
        where: { UID: UID, district: adminChecker.district },
      });

      // If the drug personality exists, delete it
      if (drugPersonality) {
        await drugPersonality.destroy();
        res
          .status(200)
          .json({ message: "Drug personality deleted successfully." });
      } else {
        res.status(404).json({ message: "Drug Personality not found" });
      }
    } else {
      res.status(403).json({
        error:
          "Permission denied. Only superadmins or admins can delete drug personalities.",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
