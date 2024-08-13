function filterURL(url) {
  return url.replace("https://", "").replace("http://", "").replace("www.", "");
}

module.exports = { filterURL };
