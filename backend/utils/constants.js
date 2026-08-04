const PORT = Number(process.env.PORT) || 5000;

const NODE_ENV = process.env.NODE_ENV || "development";

const FRONTEND_ORIGIN =
  process.env.FRONTEND_ORIGIN ||
  "http://localhost:3000";

const BACKEND_URL =
  process.env.BACKEND_URL ||
  `http://localhost:${PORT}`;

const UPLOAD_LIMIT_MB = Number(process.env.UPLOAD_LIMIT_MB) || 100;

module.exports = {
  PORT,
  NODE_ENV,
  FRONTEND_ORIGIN,
  BACKEND_URL,
  UPLOAD_LIMIT_MB,
};