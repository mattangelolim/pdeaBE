const express = require("express");
const router = express.Router();
const Vehicle_Record = require("../models/vehicle_record");
const ProgressExist = require("../models/Progress_Update");
const ProgressReport = require("../models/Progressive_Report");
const DrugPerson = require("../models/drug_personality");
const verifyToken = require("../middleware/tokenMiddleware");

router.post("/add/vehicle-record", verifyToken, async (req, res) => {
  try {
    const adminChecker = req.user;
    const field = "Vehicle Record"
    if (
      adminChecker.user_type === "superadmin" ||
      adminChecker.user_type === "admin"
    ) {
      const UID = req.query.UID;
      const vehicleRecords = req.body; // Array of vehicle records

      // Iterate through the array of vehicle records
      const createdRecords = [];
      for (const record of vehicleRecords) {
        const { plate_number, registered_address, registered_name } = record;

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

        const Vehicle_id = findDrugPersonality.Vehicle_id;

        const existingVehicle = await Vehicle_Record.findOne({
          where: {
            plate_number: plate_number,
          },
        });

        if (existingVehicle) {
          return res
            .status(400)
            .json({
              message: `Car with plate number ${plate_number} is already registered`,
            });
        }

        const createVehicleRecord = await Vehicle_Record.create({
          Vehicle_id,
          plate_number,
          registered_address,
          registered_name,
          UID,
        });

        createdRecords.push(createVehicleRecord);
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
        .status(201)
        .json({ message: "Vehicle records saved", createdRecords });
    } else {
      res.status(403).json({
        error:
          "Permission denied. Only superadmins or admins can delete drug personalities.",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/fetch/vehicle-record", async (req, res) => {
  try {
    const UID = req.query.UID;

    const vehicleRec = await Vehicle_Record.findAll({
      where: {
        UID: UID,
      },
    });
    if (!vehicleRec || vehicleRec.length === 0) {
      return res
        .status(210)
        .json({ message: "No Vehicle Record found for this UID" });
    }
    const vehicleRecords = vehicleRec.map((vehicle) => {
      return {
        id: vehicle.id,
        Vehicle_id: vehicle.Vehicle_id,
        plate_number: vehicle.plate_number,
        registered_address: vehicle.registered_address,
        registered_name: vehicle.registered_name,
      };
    });

    res.status(200).json({ vehicleRecords });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.post("/delete/vehicle-record", verifyToken, async (req, res) => {
  try {
    const adminChecker = req.user;

    if (
      adminChecker.user_type === "superadmin" ||
      adminChecker.user_type === "admin"
    ) {
      const id = req.query.id;

      // Find the drug personality by UID
      const VehicleRec = await Vehicle_Record.findOne({
        where: { id: id },
      });

      // If the drug personality exists, delete it
      if (VehicleRec) {
        await VehicleRec.destroy();
        res
          .status(200)
          .json({ message: "Vehicle Record deleted successfully." });
      } else {
        res.status(404).json({ message: "Vehicle not found" });
      }
    } else {
      res.status(403).json({
        error:
          "Permission denied. Only superadmins or admins can delete drug personalities.",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/fetch/vehicle-record/count", async (req, res) => {
  try {
    const vehicleCount = await Vehicle_Record.count({
      col: 'UID',
      distinct: true,
    });

    res
      .status(200)
      .json({ message: "Vehicle record count fetched successfully", count: vehicleCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
