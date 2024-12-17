const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  blogName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100, // Optional: Limit the blog name length
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  miniDescription: {
    type: String,
    required: true,
    trim: true,
  },
  images: [
    {
      type: String, // Store Cloudinary image URLs
      required: true,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

blogSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
