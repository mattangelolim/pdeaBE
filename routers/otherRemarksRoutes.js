const express = require("express");
const router = express.Router();
const multer = require("multer");
const verifyToken = require("../middleware/tokenMiddleware");
const { generateRandomString } = require("../utils/generatedIDS");
const Gallery = require("../models/Gallery");
const Document = require("../models/Document");
const DrugPerson = require("../models/drug_personality");
const ProgressExist = require("../models/Progress_Update");
const ProgressReport = require("../models/Progressive_Report");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/evidences/"); // Set the destination folder for uploaded images
  },
  filename: function (req, file, cb) {
    const uniqueFileName = generateRandomString(); // Generate a unique filename
    cb(null, uniqueFileName + "_" + Date.now() + ".jpg"); // Append a timestamp to the filename
  },
});

const storageFiles = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/files/"); // Set the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    const uniqueFileName = generateRandomString(); // Generate a unique filename
    cb(null, uniqueFileName + "_" + Date.now() + ".pdf"); // Append a timestamp to the filename, assuming it's a PDF file
  },
});

const uploadDocuments = multer({ storage: storageFiles });

const upload = multer({ storage });

router.post(
  "/upload/gallery",
  upload.single("file"),
  verifyToken,
  async (req, res) => {
    try {
      const adminChecker = req.user;
      const UID = req.query.UID;
      const description = req.body.description;
      const file = req.file;
      const field = "Others"

      const findPerson = await DrugPerson.findOne({
        where: {
          UID: UID,
        },
      });

      if (findPerson.length === 0) {
        return res
          .status(400)
          .json({ message: "No Person found with this UID" });
      }

      if (
        adminChecker.user_type === "superadmin" ||
        adminChecker.user_type === "admin"
      ) {

        const uploadEvidence = await Gallery.create({
          UID,
          Gallery: file.path,
          description,
        });

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
          const latestProgress = currentProgress + 15;

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
        res.status(201).json({ uploadEvidence });
      } else {
        res.status(403).json({
          error:
            "Permission denied. Only superadmins or admins can register drug personalities.",
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }
);

router.get("/person/gallery", async (req, res) => {
  try {
    const UID = req.query.UID;

    // Assuming 'Gallery' is your model and you want to find galleries by UID
    const galleries = await Gallery.findAll({
      where: {
        UID: UID,
      },
      order: [["id", "DESC"]],
    });

    if (!galleries || galleries.length === 0) {
      return res
        .status(210)
        .json({ message: "Galleries not found for this UID" });
    }

    res.status(200).json({ galleries });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.post(
  "/upload/document",
  uploadDocuments.single("pdf"),
  verifyToken,
  async (req, res) => {
    try {
      const UID = req.query.UID;
      const { documentType } = req.body;

      const field = documentType;

      const findPerson = await DrugPerson.findOne({
        where: {
          UID: UID,
        },
      });

      if (!findPerson) {
        return res
          .status(400)
          .json({ message: "No person found with this UID." });
      }

      // Check if UID and documentType are provided
      if (!UID || !documentType) {
        return res
          .status(400)
          .json({ error: "UID and documentType are required." });
      }

      const file = req.file;

      // Ensure the file is successfully uploaded and stored
      if (!file || !file.path) {
        return res.status(400).json({ error: "File upload failed." });
      }

      // Create a new document instance
      const newDocument = await Document.create({
        UID: UID,
        documentType: documentType,
        pdfPath: file.path,
      });

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
          const latestProgress = currentProgress + 15;

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

      res.status(201).json({ message: "Document uploaded successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get("/get/documents", async (req, res) => {
  try {
    const UID = req.query.UID;
    const documentType = req.query.documentType;

    // Check if UID and documentType are provided
    if (!UID || !documentType) {
      return res
        .status(400)
        .json({ success: false, error: "UID and documentType are required." });
    }

    // Check if the user with the given UID exists
    const user = await DrugPerson.findOne({
      where: {
        UID: UID,
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found." });
    }

    // Fetch documents based on UID and document type
    const documents = await Document.findAll({
      where: {
        UID: UID,
        documentType: documentType,
      },
    });

    res.status(200).json({ success: true, data: documents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

router.get("/fetch/gallery/count", async (req, res) => {
  try {
    const distinctGalleryCount = await Gallery.count({
      col: 'UID',
      distinct: true,
    });

    res.status(200).json({ message: "Distinct Gallery count fetched successfully", count: distinctGalleryCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
