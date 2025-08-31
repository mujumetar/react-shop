const mongoose = require('mongoose');
const moment = require("moment")


const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    message: {
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

const contact = mongoose.model("contact", contactSchema)


module.exports = contact