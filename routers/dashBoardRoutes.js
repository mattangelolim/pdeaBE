const express = require("express")
const router = express.Router()
const DrugPerson = require("../models/drug_personality")
const ProgressUpdate = require("../models/Progress_Update");
const sequelize = require("sequelize")

router.get("/count/active", async (req,res) =>{
    try {
        const countActive = await DrugPerson.count({
            where:{
                Classification_Rating: 0
            }
        })

        res.status(200).json({countActive})
    } catch (error) {
        console.error(error)
        res.status(500).json({message: error.message})
    }
})


router.get('/count/per/city', async (req, res) => {
    try {
        const { classification } = req.query;

        // Define a condition based on whether the classification is provided
        const condition = classification ? { Classification: classification } : {};

        const result = await DrugPerson.findAll({
            attributes: ['City', [sequelize.fn('COUNT', sequelize.col('City')), 'count']],
            where: condition,
            group: ['City'],
            raw: true,
        });

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});


router.get('/count/per/classification', async (req, res) => {
    try {
        const { city } = req.query;

        // Define a condition based on whether the city is provided
        const condition = city ? { City: city } : {};

        const result = await DrugPerson.findAll({
            attributes: ['Classification', [sequelize.fn('COUNT', sequelize.col('Classification')), 'count']],
            where: condition,
            group: ['Classification'],
            raw: true,
        });

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});


module.exports = router