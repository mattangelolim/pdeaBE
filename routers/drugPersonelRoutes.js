const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/tokenMiddleware");
const DrugPerson = require("../models/drug_personality");
const AddressModel = require("../models/Other_Address");
const multer = require("multer");
const {
  generateAffiliationID,
  generateVehicleID,
  generateBankID,
  generateRandomString,
} = require("../utils/generatedIDS");
const Progressive = require("../models/Progressive_Report");

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
router.post("/secondary/address", async (req, res) => {
  try {
    const UID = req.query.UID;
    const diffAdd = req.body;

    // Check if the user with the given UID exists
    const user = await DrugPerson.findOne({ where: { UID: UID } });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Assume diffAdd is a single address object
    const { Address, Barangay, City, Region } = diffAdd;

    // Create a single secondary address
    const secondaryAddress = await AddressModel.create({
      UID: UID,
      Address,
      Barangay,
      City,
      Region,
    });

    res.status(200).json({
      secondaryAddress,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.post("/update/secondary/address", verifyToken, async (req, res) => {
  try {
    const UID = req.query.UID;
    const newAddressDetails = req.body;

    // Check if required parameters are provided
    if (!UID || !newAddressDetails) {
      return res.status(400).json({
        success: false,
        error: "UID and newAddressDetails are required",
      });
    }

    // Check if the user with the given UID exists
    const user = await DrugPerson.findOne({ where: { UID: UID } });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Find the secondary address to update
    const secondaryAddressToUpdate = await AddressModel.findOne({
      where: {
        UID: UID,
      },
    });

    // Check if the address record exists
    if (!secondaryAddressToUpdate) {
      return res
        .status(404)
        .json({ success: false, error: "Secondary address not found" });
    }

    // Update the address details
    const { Address, Barangay, City, Region } = newAddressDetails;
    secondaryAddressToUpdate.Address = Address;
    secondaryAddressToUpdate.Barangay = Barangay;
    secondaryAddressToUpdate.City = City;
    secondaryAddressToUpdate.Region = Region;

    // Save the updated record
    await secondaryAddressToUpdate.save();

    res.status(200).json({ success: true, data: secondaryAddressToUpdate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/get/secondary/address", async (req, res) => {
  try {
    const UID = req.query.UID;

    // Check if UID is provided
    if (!UID) {
      return res
        .status(400)
        .json({ success: false, error: "UID is required in the query parameters" });
    }

    // Check if the user with the given UID exists
    const user = await DrugPerson.findOne({ where: { UID: UID } });

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found." });
    }

    // Fetch secondary addresses based on UID
    const secondaryAddresses = await AddressModel.findAll({
      where: {
        UID: UID,
      },
    });

    res.status(200).json({ success: true, data: secondaryAddresses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
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
        } = req.body;

        // FUNCTIONS TO GENERATE DIFFERENT IDS
        const Affiliation_id = generateAffiliationID(UID);
        const Vehicle_id = generateVehicleID(UID);
        const Bank_id = generateBankID(UID);

        let picturePath = null;

        if (req.file) {
          picturePath = req.file.path;
        }

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
            Picture: picturePath,
            Affiliation_id,
            Vehicle_id,
            Bank_id,
          });

          const addProgressive = await Progressive.create({
            UID,
            progress: 0,
          });

          res.status(201).json({
            message: "Drug personality created successfully.",
            DrugPersonnel,
          });
        } else {
          res.status(400).json({ message: "Drug Personality already exists" });
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

    res.status(200).json({ personalInfo });
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
