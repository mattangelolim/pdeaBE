const express = require("express");
const router = express.Router();
const Illegal_Drugs = require("../models/illegal_drugs");
const verifyToken = require("../middleware/tokenMiddleware");

// Route to add data about illegal drug products
router.post("/add/illegal-drugs", verifyToken, async (req, res) => {
  try {
    // Extract the data from the request body
    const { drug_name } = req.body;
    const UID = req.query.UID;

    // Create a new record in the Illegal_Drugs table
    const newIllegalDrug = await Illegal_Drugs.create({ UID, drug_name });

    res.status(201).json({ success: true, data: newIllegalDrug });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
