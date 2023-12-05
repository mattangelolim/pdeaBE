const express = require("express");
const router = express.Router();
const Finance = require("../models/financial_account");
const DrugPerson = require("../models/drug_personality");
const verifyToken = require("../middleware/tokenMiddleware");

router.post("/add/bank-record", verifyToken, async (req, res) => {
  try {
    const adminChecker = req.user;
    if (
      adminChecker.user_type === "superadmin" ||
      adminChecker.user_type === "admin"
    ) {
      const UID = req.query.UID;
      const { bank_number, bank_type, name } = req.body;

      const findDrugPersonality = await DrugPerson.findOne({
        where: {
          UID: UID,
        },
      });

      if (!findDrugPersonality) {
        return res
          .status(400)
          .json({ message: "No Drug Personality has this UID" });
      }

      const Bank_id = findDrugPersonality.Bank_id;
      const bankDetails = await Finance.create({
        Bank_id: Bank_id,
        bank_number,
        bank_type,
        name,
        UID: UID,
      });

      res
        .status(200)
        .json({ message: "Bank details added successfully", bankDetails });
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

router.post("/delete/bank-record/", verifyToken, async (req, res) => {
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

module.exports = router;
