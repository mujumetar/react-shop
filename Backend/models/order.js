const mongoose = require('mongoose');
const moment = require("moment")


const orderSchema = new mongoose.Schema(
    {
        customerName: { type: String, required: true },
        customerPhone: { type: String, required: true },
        address: {
            street: { type: String, required: true },
            city: { type: String, required: true },
            pincode: { type: String, required: true },
            state: { type: String, required: true },
            landmark: { type: String }
        },
        items: [
            {
                product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
                quantity: { type: Number, required: true },
                price: { type: Number, required: true }
            }
        ],
        totalAmount: { type: Number, required: true },
        deliveryStatus: {
            type: String,
            enum: ["Pending", "Accepted", "Out for Delivery", "Delivered", "Cancelled"],
            default: "Pending"
        },
        deliveryDate: { type: Date },
        notes: { type: String }
    },
    { timestamps: true }
)

const order = mongoose.model("order", orderSchema)


module.exports = order