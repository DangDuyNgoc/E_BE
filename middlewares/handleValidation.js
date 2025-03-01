import { validationResult } from "express-validator";
import { removeImage } from "../helpers/handleImageHelper.js";

export const validateFileExistence = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ mess: "File is required!" });
  }
  next();
};

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (req.file) {
      const filePath = req.file.filename;
      removeImage(filePath);
    }
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};
