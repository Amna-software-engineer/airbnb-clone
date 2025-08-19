const mongoose = require("mongoose");

const bookingsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    home: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Home"
    },
    checkIn: Date,
    checkOut: Date,
    guest: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
})

module.exports = mongoose.model("bookings", bookingsSchema);