const express = require("express");
const router = express.Router();
const ProgressReport = require("../models/Progressive_Report");
const DrugPerson = require("../models/drug_personality");
const ProgressUpdate = require("../models/Progress_Update");
const verifyToken = require("../middleware/tokenMiddleware");

router.get("/progress/report", async (req, res) => {
    try {
        // Fetch all progress reports
        const allProgressReports = await ProgressReport.findAll();
        const progressUIDs = allProgressReports.map(report => report.UID);

        // Fetch DrugPerson data using UIDs from ProgressReport
        const drugPersonData = await DrugPerson.findAll({
            where: { UID: progressUIDs }, // Match UIDs from ProgressReport
            attributes: ['UID', 'First_Name', 'Middle_Name', 'Last_Name', 'Classification', 'City', 'Classification_Rating']
        });

        // Creating a map of UID to drugPersonData for easier access
        const drugPersonMap = drugPersonData.reduce((map, person) => {
            map[person.UID] = person;
            return map;
        }, {});

        const addHoursToDate = (date, hours) => {
            return new Date(new Date(date).getTime() + hours * 60 * 60 * 1000);
        };

        // Combining the data from ProgressReport and DrugPerson with adjusted timestamps
        const combinedData = allProgressReports.map(report => {
            const drugPerson = drugPersonMap[report.UID];
            const fullName = `${drugPerson.First_Name} ${drugPerson.Middle_Name} ${drugPerson.Last_Name}`;

            // Adjusting createdAt and updatedAt timestamps by adding 8 hours
            const createdAt = addHoursToDate(report.createdAt, 8);
            const updatedAt = addHoursToDate(report.updatedAt, 8);

            // Formatting adjusted timestamps to string format
            const formattedCreatedAt = createdAt.toISOString();
            const formattedUpdatedAt = updatedAt.toISOString();

            // Return the combined data with adjusted timestamps and classification
            return {
                ...report.get({ plain: true }), // Get plain object from Sequelize model
                full_name: fullName,
                classification: drugPerson ? drugPerson.Classification : null,
                status: drugPerson.Classification_Rating !== 0 ? getRatingWord(drugPerson.Classification_Rating) : 'Not Set',
                city: drugPerson ? drugPerson.City : null,
                createdAt: formattedCreatedAt,
                updatedAt: formattedUpdatedAt,
            };
        });

        // Send the combined data back as a response
        res.status(200).json(combinedData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }

});

router.get("/progress/status", async (req, res) => {
    try {
        const UID = req.query.UID

        const FilledStatus = await ProgressUpdate.findAll({
            where: {
                UID: UID
            },
            attributes: ['field']
        })

        const combinedFields = FilledStatus.reduce((combined, item) => {
            combined[item.field] = true; // You can assign any value here if needed
            return combined;
        }, {});

        res.status(200).json({ combinedFields });
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: error.message })
    }
})

router.post("/declare/rating", verifyToken, async (req, res) => {
    try {
        const UID = req.query.UID

        const chosenDrugperson = await ProgressReport.findOne({
            where: {
                UID: UID
            }
        })

        const progress = chosenDrugperson.dataValues.progress
        if (progress <= 69) {
            return res.status(204).json({ message: "Progress is not 70% above to declare personality rating" })
        }

        const { Classification_Rating } = req.body;

        // Update Classification_Rating in DrugPerson 
        const updatedUser = await DrugPerson.update(
            { Classification_Rating },
            {
                where: {
                    UID: UID
                }
            }
        );

        const declaration = await ProgressUpdate.create({
            UID,
            field: "Target Value",
        })

        res.status(200).json({ message: "Classification Rating updated successfully", updatedUser });


    } catch (error) {
        console.error(error)
        res.status(500).json({ message: error.message })
    }
})

module.exports = router;

function getRatingWord(rating) {
    switch (rating) {
        case 1:
            return 'Low Target';
        case 2:
            return 'Medium Target';
        case 3:
            return 'High Target';
        case 4:
            return 'Very High Target';
        case 5:
            return 'Extremely High Target';
        default:
            return '';
    }
}