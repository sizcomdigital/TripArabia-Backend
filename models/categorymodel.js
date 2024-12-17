const mongoose = require('mongoose');

// Define the Category schema
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

// Add a pre-save middleware to set the updatedAt field
categorySchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create the Category model
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
