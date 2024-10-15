function detectLanguage(req, res, next) {
  const language = req.headers["accept-language"] || "pl";
  req.language = language;
  next();
}

module.exports = { detectLanguage };
