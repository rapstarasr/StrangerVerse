const multer = require("multer");
const path = require("path");

module.exports = function registerUploadRoute(app, uploadService) {
  const storage = multer.diskStorage(uploadService.createStorage());

  const allowedMimeTypes = [
    // Images
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",

    // Video
    "video/mp4",
    "video/webm",
    "video/quicktime",

    // Audio
    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
    "audio/webm",
    "audio/ogg",
    "audio/aac",
    "audio/mp4",

    // Documents
    "application/pdf",

    // Generic files
    "application/zip",
    "application/x-zip-compressed",
    "application/octet-stream",
    "text/plain",
  ];

  const upload = multer({
    storage,

    limits: {
      fileSize: 100 * 1024 * 1024,
    },

    fileFilter(req, file, cb) {
      if (allowedMimeTypes.includes(file.mimetype)) {
        return cb(null, true);
      }

      return cb(new Error("Unsupported file type."));
    },
  });

  app.post("/upload", (req, res) => {
    upload.single("file")(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }

      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded.",
        });
      }

      return res.json({
        success: true,
        file: uploadService.buildUploadedFile(req.file),
      });
    });
  });
};