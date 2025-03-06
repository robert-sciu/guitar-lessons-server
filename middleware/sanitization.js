function sanitize(req, res, next) {
  function sanitizeObject(obj) {
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === "string") {
        obj[key] = obj[key]
          .trim()
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/&/g, "&amp;")
          .replace(/'/g, "&#39;")
          .replace(/"/g, "&quot;");
      }
    });
  }
  if (req.body) {
    sanitizeObject(req.body);
  }
  if (req.query) {
    sanitizeObject(req.query);
  }
  if (req.params) {
    sanitizeObject(req.params);
  }
  next();
}

module.exports = { sanitize };
