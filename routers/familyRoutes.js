const express = require("express")
const router = express.Router()
const RelativeModel = require("../models/RelativeModel")

router.post("/add/relative", async (req, res) => {
    try {
        const UID = req.query.UID
        const { name, relationship } = req.body

        const PersonalityRelative = await RelativeModel.create({
            UID,
            Name: name,
            Relationship: relationship
        })

        res.status(200).json({ PersonalityRelative })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: error.message })
    }
})

router.get("/get/relative", async (req, res) => {
    try {
        const UID = req.query.UID;
        // const relationship = req.query.relationship;

        const relative = await RelativeModel.findAll({
            where:{
                UID: UID
            }
        });

        if (!relative) {
            return res.status(200).json({ message: "Relative not found" });
        }

        res.status(200).json({ relative:relative });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});
router.post("/update/relative", async (req, res) => {
    try {
        const id = req.query.id;
        const name = req.body.name;

        // Assuming you have a method like findByPk in your model to retrieve the record by primary key
        const relative = await RelativeModel.findByPk(id);

        if (!relative) {
            return res.status(404).json({ message: "Relative not found" });
        }

        // Update the relevant fields
        relative.Name = name;

        // Save the updated record
        await relative.save();

        res.status(200).json({ message: "Updated Successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
})




module.exports = router