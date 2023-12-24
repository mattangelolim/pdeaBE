const express = require("express");
const router = express.Router();
const Finance = require("../models/financial_account");
const DrugPerson = require("../models/drug_personality");
const ProgressExist = require("../models/Progress_Update");
const ProgressReport = require("../models/Progressive_Report")
const verifyToken = require("../middleware/tokenMiddleware");

router.post("/add/bank-record", verifyToken, async (req, res) => {
  try {
    const adminChecker = req.user;
    const field = "Bank Record";
    if (
      adminChecker.user_type === "superadmin" ||
      adminChecker.user_type === "admin"
    ) {
      const UID = req.query.UID;
      const bankRecords = req.body; // Expecting an array of bank records

      const findDrugPersonality = await DrugPerson.findOne({
        where: {
          UID: UID,
        },
      });

      if (!findDrugPersonality) {
        return res
          .status(210)
          .json({ message: "No Drug Personality has this UID" });
      }

      const Bank_id = findDrugPersonality.Bank_id;

      // Process each bank record in the array
      const bankDetailsArray = [];
      for (const bankRecord of bankRecords) {
        const { bank_number, bank_type, name } = bankRecord;
        const bankDetails = await Finance.create({
          Bank_id: Bank_id,
          bank_number,
          bank_type,
          name,
          UID: UID,
        });
        bankDetailsArray.push(bankDetails);
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
          const latestProgress = currentProgress + 10;

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

      res
        .status(200)
        .json({ message: "Bank details added successfully", bankDetails: bankDetailsArray });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});


router.get("/fetch/bank-record", async (req, res) => {
  try {
    const UID = req.query.UID;

    const bankDetails = await Finance.findAll({
      where: {
        UID: UID,
      },
    });

    if (!bankDetails) {
      return res.status(404).json({ message: "Bank details not found" });
    }

    res
      .status(200)
      .json({ message: "Bank details fetched successfully", bankDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.post("/delete/bank-record", verifyToken, async (req, res) => {
  try {
    const id = req.query.id;

    const deletedBankDetails = await Finance.destroy({
      where: {
        id: id,
      },
    });

    if (!deletedBankDetails) {
      return res.status(404).json({ message: "Bank details not found" });
    }

    res.status(200).json({ message: "Bank details deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/fetch/bank-record/count", async (req, res) => {
  try {
    const bankRecordCount = await Finance.count();

    res
      .status(200)
      .json({ message: "Bank record count fetched successfully", count: bankRecordCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
