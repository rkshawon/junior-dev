"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.imageUp = void 0;
var _fs = _interopRequireDefault(require("fs"));
var _path = _interopRequireDefault(require("path"));
var _crypto = require("crypto");
// const uniq = () => new Date().getTime().toString() + Math.ceil(Math.random() * 1000).toString();
const imagesDir = `${_path.default.resolve()}/images`;

/**
 * Saves an image to the server from the provided link.
 *
 * @param {string} link - The link to the image.
 * @returns {string} The file path of the saved image.
 */
const imageUp = async link => {
  try {
    if (!link) return null;
    const extIndex = link.lastIndexOf('.'); // Check if link has a file extension
    if (extIndex === -1) throw new Error('Link does not contain a file extension.');
    const ext = link.substring(extIndex + 1); // Get file extension
    if (!['png', 'jpg', 'jpeg', 'svg', 'gif', 'avif', 'webp'].includes(ext.toLowerCase())) throw new Error('Invalid file extension.'); // Check if file extension is valid
    const fileName = (0, _crypto.randomBytes)(16).toString('hex') + '.' + ext; // Generate a unique file name
    if (!_fs.default.existsSync(imagesDir)) _fs.default.mkdirSync(imagesDir);
    const buffer = _fs.default.readFileSync(link); // Read image file from link
    const filePath = `${imagesDir}/${fileName}`; // Write image file to images directory
    _fs.default.writeFileSync(filePath, buffer);
    return `images/${fileName}`; // Return file path
  } catch (e) {
    console.error(e);
    throw new Error('Failed to save image.');
  }
};
exports.imageUp = imageUp;