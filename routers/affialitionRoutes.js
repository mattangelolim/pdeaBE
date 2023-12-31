const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/tokenMiddleware");
const multer = require("multer");
const DrugPerson = require("../models/drug_personality");
const Affiliation = require("../models/affiliations");
const ProgressExist = require("../models/Progress_Update");
const ProgressReport = require("../models/Progressive_Report")
const { generateRandomString } = require("../utils/generatedIDS");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/affiliates"); // Set the destination folder for uploaded images
  },
  filename: function (req, file, cb) {
    const uniqueFileName = generateRandomString();
    cb(null, uniqueFileName + "_" + Date.now() + ".jpg");
  },
});

const upload = multer({ storage });

router.post(
  "/create/affiliation",
  upload.single("file"),
  verifyToken,
  async (req, res) => {
    try {
      const adminChecker = req.user;
      if (
        adminChecker.user_type === "superadmin" ||
        adminChecker.user_type === "admin"
      ) {
        const UID = req.query.UID;
        const field = "Affiliation";
        const { Name, Gender, Relationship, Address, Barangay, City, Region } =
          req.body;

        const findDrugPersonality = await DrugPerson.findOne({
          where: {
            UID: UID,
          },
        });
        if (!findDrugPersonality) {
          return res
            .status(400)
            .json({ message: "No drug personality found with this UID" });
        }

        console.log("Affiliation ID:", findDrugPersonality.Affiliation_id);
        const affiliationId = findDrugPersonality.Affiliation_id;

        let picturePath = null;

        if (req.file) {
          picturePath = req.file.path;
        }

        const createAffiliation = await Affiliation.create({
          UID,
          Affiliation_id: affiliationId,
          Name,
          Gender,
          Relationship,
          Address,
          Barangay,
          City,
          Region,
          Picture:picturePath,
        });

        // Check if it's the first time and update progress
        const existingProgress = await ProgressExist.findOne({
          where: {
            UID: UID,
            field: field,
          },
        });

        if (!existingProgress) {
          // If it doesn't exist, add 15 for the current progress
          const addProgress = await ProgressExist.create({
            UID,
            field,
          });

          const incrementProgressive = await ProgressReport.findOne({
            where: {
              UID,
            },
          });

          if (incrementProgressive) {
            // If the record is found, increment the progress by 15
            const currentProgress = incrementProgressive.progress;
            const latestProgress = currentProgress + 15;

            // Update the progress in the ProgressReport table
            await ProgressReport.update(
              { progress: latestProgress },
              {
                where: {
                  UID,
                },
              }
            );
          }
        }
        res.status(201).json({
          createAffiliation,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);


router.post(
  "/update/affiliation",
  upload.single("file"),
  verifyToken,
  async (req, res) => {
    try {
      const adminChecker = req.user;
      if (
        adminChecker.user_type === "superadmin" ||
        adminChecker.user_type === "admin"
      ) {
        const id = req.query.id;
        const UID = req.query.UID;
        const { Name, Gender, Relationship, Address, Barangay, City, Region } =
          req.body;

        const findAffiliation = await Affiliation.findOne({
          where: {
            id: id,
            UID: UID,
          },
        });

        if (!findAffiliation) {
          return res.status(404).json({ message: "Affiliation not found" });
        }

        // Update the fields
        findAffiliation.Name = Name || findAffiliation.Name;
        findAffiliation.Gender = Gender || findAffiliation.Gender;
        findAffiliation.Relationship = Relationship || findAffiliation.Relationship;
        findAffiliation.Address = Address || findAffiliation.Address;
        findAffiliation.Barangay = Barangay || findAffiliation.Barangay;
        findAffiliation.City = City || findAffiliation.City;
        findAffiliation.Region = Region || findAffiliation.Region;

        // Check if a new file is provided
        if (req.file) {
          findAffiliation.Picture = req.file.path;
        }

        await findAffiliation.save();

        res.status(200).json({
          message: "Affiliation updated successfully",
          findAffiliation,
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
  }
);

router.get("/fetch/affiliations", async (req, res) => {
  try {
    const UID = req.query.UID;

    const affiliations = await Affiliation.findAll({
      where: {
        UID: UID,
      },
    });

    if (!affiliations || affiliations.length === 0) {
      return res
        .status(210)
        .json({ message: "No affiliations found for this UID" });
    }

    // Transform the affiliations to include the picture data
    const affiliationsWithPictures = affiliations.map((affiliation) => {
      return {
        id: affiliation.id,
        Affiliation_id: affiliation.Affiliation_id,
        Name: affiliation.Name,
        Gender: affiliation.Gender,
        Relationship: affiliation.Relationship,
        Address: affiliation.Address,
        Barangay: affiliation.Barangay,
        City: affiliation.City,
        Region: affiliation.Region,
        Picture: affiliation.Picture,
      };
    });
    res.status(200).json({ affiliations: affiliationsWithPictures });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.post("/delete/affiliation", verifyToken, async (req, res) => {
  try {
    const adminChecker = req.user;

    if (
      adminChecker.user_type === "superadmin" ||
      adminChecker.user_type === "admin"
    ) {
      const id = req.query.id;

      // Find the drug personality by UID
      const Affiliations = await Affiliation.findOne({
        where: { id: id },
      });

      // If the drug personality exists, delete it
      if (Affiliations) {
        await Affiliations.destroy();
        res.status(200).json({ message: "Affiliation deleted successfully." });
      } else {
        res.status(404).json({ message: "Affiliation not found" });
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
