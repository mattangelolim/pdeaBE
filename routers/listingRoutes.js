const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/tokenMiddleware");
const DrugPerson = require("../models/drug_personality");
const { emitPersonalityListUpdate } = require("../socket");

router.get("/personality/list", verifyToken, async (req, res) => {
  try {
    // Assuming adminChecker is a district in the req.user object
    const adminDistrict = req.user.district;

    // Fetch drug personalities where district is equal to adminChecker
    const drugPersonalities = await DrugPerson.findAll({
      where: { district: adminDistrict },
    });

    // Send the list as a response
    res.json(drugPersonalities);

    emitPersonalityListUpdate(drugPersonalities);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
