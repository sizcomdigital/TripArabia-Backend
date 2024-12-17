const mongoose = require('mongoose');

// Define the Tour schema
const tourSchema = new mongoose.Schema({
  tourName: {
    type: String,
    required: [true, 'Tour name is required'],
    trim: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required'],
  },
  hoursOfTrip: {
    type: Number,
    required: [true, 'Number of hours is required'],
    min: [1, 'Hours of trip must be at least 1 hour'],
  },
  tripTime: {
    from: { type: String, required: true },
    to: { type: String, required: true },
  },
  actualPrice: {
    type: Number,
    required: [true, 'Actual price is required'],
    min: [0, 'Price must be a positive number'],
  },
  offerPrice: {
    type: Number,
    required: [true, 'Offer price is required'],
    min: [0, 'Offer price must be a positive number'],
  },
  locationName: {
    type: String,
    required: [true, 'Location name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  included: {
    type: [String],
    default: [],
  },
  excluded: {
    type: [String],
    default: [],
  },
  tourHighlights: {
    type: [String],
    default: [],
  },
  hashedId:{
  type: String
  },
  images: {
    type: [String],  // Array of image URLs
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
  status: {
    type: Boolean,
    default:true,
  }
});

// Pre-save middleware to set updatedAt
tourSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create the Tour model
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
