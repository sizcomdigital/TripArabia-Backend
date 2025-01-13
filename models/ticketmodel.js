// Import Mongoose
const mongoose = require('mongoose');

// Define the ticket schema
const ticketSchema = new mongoose.Schema({
    ticketName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    images: {
        type: [String],  // Array of image URLs
        default: [],
      },
    offerPrice: {
        type: Number,
        required: true,
        validate: {
            validator: function(value) {
                return value >= 0;
            },
            message: 'Offer price must be a non-negative number.'
        }
    },
    actualPrice: {
        type: Number,
        required: true,
        validate: {
            validator: function(value) {
                return value >= 0;
            },
            message: 'Actual price must be a non-negative number.'
        }
    },
    offPercentage: {
        type: Number,
        required: true,
        validate: {
            validator: function(value) {
                return value >= 0 && value <= 100;
            },
            message: 'Off percentage must be between 0 and 100.'
        }
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// Create the ticket model
const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
