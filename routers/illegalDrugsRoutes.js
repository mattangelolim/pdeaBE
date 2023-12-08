const express = require("express");
const router = express.Router();
const Illegal_Drugs = require("../models/illegal_drugs");
const verifyToken = require("../middleware/tokenMiddleware");

// Route to add data about illegal drug products
router.post("/add/illegal-drugs", verifyToken, async (req, res) => {
  try {
    const UID = req.query.UID;
    const drugRecords = req.body;

    if (!Array.isArray(drugRecords) || drugRecords.length === 0) {
      return res.status(400).json({ success: false, error: "Invalid drugRecords data" });
    }

    // Create records in the Illegal_Drugs table for each drug in the array
    const illegalDrugsArray = [];
    for (const drugRecord of drugRecords) {
      const { drug_name } = drugRecord;

      if (typeof drug_name !== "string") {
        return res.status(400).json({ success: false, error: "Invalid drug_name type" });
      }

      const newIllegalDrug = await Illegal_Drugs.create({ UID, drug_name });
      illegalDrugsArray.push(newIllegalDrug);
    }

    res.status(201).json({ success: true, data: illegalDrugsArray });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});



module.exports = router;
