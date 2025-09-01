const mongoose = require('mongoose');
const moment = require("moment")


const orderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    comments: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    pincode: {
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

const order = mongoose.model("order", orderSchema)


module.exports = order