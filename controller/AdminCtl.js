const mongoose = require("mongoose");
const multer = require("multer");
const admin = require("../models/adminTbl");


module.exports.dashboard = (req, res) => {
  try {
    res.render("dashboard");
  } catch (err) {
    console.log("err");
  }
};