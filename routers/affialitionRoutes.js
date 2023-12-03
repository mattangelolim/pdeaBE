const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/tokenMiddleware");
const multer = require("multer");
const DrugPerson = require("../models/drug_personality");
const Affiliation = require("../models/affiliations");

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

router.post("/create/affiliation", upload.single("file"), async (req, res) => {
  try {
    const UID = req.query.UID;
    const { Name, Gender, Relationship } = req.body;

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
    // const affiliationId = ;
    console.log("Affiliation ID:", findDrugPersonality.Affiliation_id);
    const affiliationId = findDrugPersonality.Affiliation_id

    const file = req.file;

    const createAffiliation = await Affiliation.create({
      UID,
      Affiliation_id: affiliationId,
      Name,
      Gender,
      Relationship,
      Picture: file.path,
    });

    res
      .status(201)
      .json({ message: "Affiliation created successfully", createAffiliation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.post("/update/affiliation", upload.single("file"), async (req, res) => {
  try {
      const id = req.query.id;
      const UID = req.query.UID;
      const { Name, Gender, Relationship } = req.body;

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

      // Check if a new file is provided
      if (req.file) {
          findAffiliation.Picture = req.file.path;
      }

      await findAffiliation.save();

      res.status(200).json({ message: "Affiliation updated successfully", findAffiliation });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
  }
});

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
        .status(404)
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
        Picture: affiliation.Picture, 
      };
    });

    res.status(200).json({ affiliations: affiliationsWithPictures });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
