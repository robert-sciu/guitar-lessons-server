const sharp = require("sharp");

function compressImage(width, buffer) {
  return sharp(buffer)
    .resize({ width: width, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer();
}

const resolutions = {
  small: 500,
  medium: 960,
  big: 1920,
  mobile: 500,
  lazy: 100,
};

function sharpCompressor(size, buffer) {
  switch (size) {
    case "small":
      return compressImage(resolutions.small, buffer);
    case "medium":
      return compressImage(resolutions.medium, buffer);
    case "large":
      return compressImage(resolutions.big, buffer);
    case "mobile":
      return compressImage(resolutions.mobile, buffer);
    case "lazy":
      return compressImage(resolutions.lazy, buffer);
    default:
      return buffer;
  }
}

async function fileCompressor(size, file) {
  try {
    const compressedImage = await sharpCompressor(size, file.buffer);
    const data = {
      ...file,
      buffer: compressedImage,
    };
    return data;
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = fileCompressor;
