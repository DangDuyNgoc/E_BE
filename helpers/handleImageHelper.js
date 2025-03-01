import multer from "multer";
import path from "path";
import fs from "fs";

const __dirname = path.resolve();

export const saveImage = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, "assets/images");
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type, only images are allowed!"), false);
    }
  },
});

export const removeImage = (filePath) => {
  if (!filePath) {
    console.log("Invalid file path");
    return;
  }
  const imagePath = path.join(__dirname, "assets", "images", filePath);
  console.log("Deleting file:", imagePath);
  if (!fs.existsSync(imagePath)) {
    console.log("File not found:", imagePath);
    return;
  }
  fs.unlink(imagePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
    } else {
      console.log("File deleted successfully:", imagePath);
    }
  });
};
