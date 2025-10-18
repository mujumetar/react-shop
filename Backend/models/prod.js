const mongoose = require('mongoose');
const moment = require("moment")


const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        category: { type: String },
        price: { type: Number, required: true },
        stock: { type: Number, default: 0 },
        description: { type: String },
        img_url: { type: String }
    },
    { timestamps: true }
)
const product = mongoose.model("product", productSchema)


module.exports = product