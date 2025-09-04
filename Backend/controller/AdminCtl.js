const mongoose = require("mongoose");
const multer = require("multer");
const contactModel = require("../models/contact");
// const admin = require("../models/adminTbl");
const productModel = require("../models/prod");

module.exports.test = async (req, res) => {
  const response = await contactModel.find();
  const prod = await productModel.find();
  // res.send(contact)
  return res.json({ contact: response, product: prod });
};
