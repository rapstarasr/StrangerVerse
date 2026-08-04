const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");
const { BACKEND_URL } = require("../utils/constants");

class UploadService {
  constructor(uploadDir) {
    this.uploadDir = uploadDir;
    this.ensureDirectory();
  }

  ensureDirectory() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  createStorage() {
    return {
      destination: this.uploadDir,
      filename: (req, file, cb) => {
        cb(null, `${uuid()}${path.extname(file.originalname)}`);
      },
    };
  }

  buildUploadedFile(file) {
    return {
      id: Date.now(),

      originalName: file.originalname,

      filename: file.filename,

      size: file.size,

      type: file.mimetype,

      extension: path.extname(file.originalname),

      url: `${BACKEND_URL}/uploads/${file.filename}`,

      uploadedAt: Date.now(),
    };
  }
}

module.exports = UploadService;