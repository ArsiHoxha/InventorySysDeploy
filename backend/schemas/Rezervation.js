// models/Reservation.js
const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    productId: {
        type:String,
        ref: 'Product',
        required: true
    },
    userId: {
        type: String,
        ref: 'User', // Assuming you have a User model
        required: true
    },
    reservedAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    // Add more fields as needed
}, { timestamps: true });

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
