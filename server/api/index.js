// Vercel serverless entry: wraps the Express app in /server/index.js.
// All routes (/, /api/*, /uploads) are handled by the Express app.
const app = require("../index.js");

module.exports = (req, res) => app(req, res);
