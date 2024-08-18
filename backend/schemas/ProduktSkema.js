const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, default: uuidv4 },
  productNameTxt: { type: String, required: false },
  productImg: { type: String, required: false },
  priceTxt: { type: String, required: false },
  descriptionTxt: { type: String, required: false },
  filename: { type: String, required: true },
  path: { type: String, required: true },
  originalname: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
});

module.exports = mongoose.model('ProducMain', productSchema);
