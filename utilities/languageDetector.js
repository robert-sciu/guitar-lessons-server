function detectLanguage(req, res, next) {
  const language = req.headers["accept-language"];
  if (language === "en") {
    req.language = "en";
    return next();
  } else {
    req.language = "pl";
    return next();
  }
}

module.exports = { detectLanguage };
