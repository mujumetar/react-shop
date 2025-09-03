const mongoose = require('mongoose');
const moment = require("moment")


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true      
    },
    category: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true,
        required: true
    },
    createdAt: {
        type: String,
        default: moment().format('MMMM Do YYYY, h:mm:ss a')
    },
    updatedAt: {
        type: String,
        default: moment().format('MMMM Do YYYY, h:mm:ss a')


    }
})

const product = mongoose.model("product", productSchema)


module.exports = product