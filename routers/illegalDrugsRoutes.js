const express = require("express");
const router = express.Router();
const Illegal_Drugs = require("../models/illegal_drugs");
const ProgressExist = require("../models/Progress_Update");
const ProgressReport = require("../models/Progressive_Report");
const verifyToken = require("../middleware/tokenMiddleware");

// Route to add data about illegal drug products
router.post("/add/illegal-drugs", verifyToken, async (req, res) => {
  try {
    const UID = req.query.UID;
    const field = "Drugs";
    const drugRecords = req.body;

    if (!Array.isArray(drugRecords) || drugRecords.length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid drugRecords data" });
    }

    // Create records in the Illegal_Drugs table for each drug in the array
    const illegalDrugsArray = [];
    for (const drugRecord of drugRecords) {
      const { drug_name } = drugRecord;

      if (typeof drug_name !== "string") {
        return res
          .status(400)
          .json({ success: false, error: "Invalid drug_name type" });
      }

      const newIllegalDrug = await Illegal_Drugs.create({ UID, drug_name });
      illegalDrugsArray.push(newIllegalDrug);
    }

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
        const latestProgress = currentProgress + 5;

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

    res.status(201).json({ success: true, data: illegalDrugsArray });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/get/illegal-drugs", async (req, res) => {
  try {
    const UID = req.query.UID;

    // Check if UID is provided
    if (!UID) {
      return res
        .status(400)
        .json({ success: false, error: "UID is required in the query parameters" });
    }

    // Fetch drug information based on UID
    const drugRecords = await Illegal_Drugs.findAll({
      where: {
        UID: UID,
      },
    });
    const drugNames = drugRecords.map(record => record.drug_name);

    res.status(200).json({ success: true, data: drugNames });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


module.exports = router;
