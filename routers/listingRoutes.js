const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/tokenMiddleware");
const DrugPerson = require("../models/drug_personality");
// const { emitPersonalityListUpdate } = require("../socket");

router.get("/personality/list", verifyToken, async (req, res) => {
  try {
    // Assuming adminChecker is a district in the req.user object
    const classification = req.query.classification;

    let drugPersonalities;

    if (classification === "All") {
      drugPersonalities = await DrugPerson.findAll({
        order: [["Classification_Rating", "DESC"]],
      });
    } else {
      drugPersonalities = await DrugPerson.findAll({
        where: { classification: classification },
        order: [["Classification_Rating", "DESC"]],
      });
    }

    // Calculate age for each object based on birthdate
    const drugPersonalitiesWithAge = drugPersonalities.map((person) => {
      const birthdate = new Date(person.Birthdate);
      console.log(birthdate);
      const now = new Date();
      console.log(now); 
      let age = now.getYear() - birthdate.getYear();
      // age = Math.floor(age);

      if (
        now.getMonth() < birthdate.getMonth() ||
        (now.getMonth() === birthdate.getMonth() &&
          now.getDate() < birthdate.getDate())
      ) {
        age = age - 1;
      }

      // Manually copy properties and add age to create a new object
      const newPerson = {
        ...person.toJSON(),
        age,
      };

      return newPerson;
    });

    // Send the list with age as a response
    res.json(drugPersonalitiesWithAge);

    // emitPersonalityListUpdate(drugPersonalitiesWithAge);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


module.exports = router;
