const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/tokenMiddleware");
const DrugPerson = require("../models/drug_personality");
const {
    generateAffiliationID,
    generateVehicleID,
    generateBankID,
    generateRandomString
  } = require("../utils/generatedIDS");



router.post("/register/drug-personality", verifyToken, async (req, res) => {
  try {
    const adminChecker = req.user;

    const UID = generateRandomString();
    console.log(UID)

    if (adminChecker.user_type === "superadmin" || adminChecker.user_type === "admin") {
        const {
            Name,
            newName,
            Birthdate,
            newBirthdate,
            Address,
            Gender,
            Civil_Status,
            Picture,
        } = req.body;
                
        // FUNCTIONS TO GENERATE DIFFERENT IDS
        const Affiliation_id = generateAffiliationID(Name);
        const Vehicle_id = generateVehicleID(Name);
        const Bank_id = generateBankID(Name);

        // Find the drug personality by UID
        const drugPersonality = await DrugPerson.findOne({
            where: { 
                Name: Name,
                Birthdate:Birthdate
             },
        });
        // If the drug personality doesn't exist, create a new one
        if (!drugPersonality) {
           const DrugPersonnel =  await DrugPerson.create({
                UID,
                district: adminChecker.district,
                Name,
                Birthdate,
                Address,
                Gender,
                Civil_Status,
                Picture,
                Affiliation_id,
                Vehicle_id,
                Bank_id,
            });
            res.status(201).json({ message: "Drug personality created successfully.", DrugPersonnel });
        } else {
            // If the drug personality exists, update the data
            const updatedDrugPersonnel = await drugPersonality.update({
                Name: newName || Name, 
                Birthdate: newBirthdate || Birthdate, 
                Address,
                Gender,
                Civil_Status,
                Picture,
            });
            res.status(200).json({ message: "Drug personality updated successfully.", updatedDrugPersonnel });
        }
    } else {
        res.status(403).json({ error: "Permission denied. Only superadmins or admins can register drug personalities." });
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({message: error.message})
  }
});

module.exports = router;
