// Import necessary modules
const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

// Define post schema
const likeSchema = mongoose.Schema(
  {
    user_id: {
      type: String,
      require: true,
    },
    post_id: {
      type: String,
    },
    isLike: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Apply plugins to schema
likeSchema.plugin(toJSON);
likeSchema.plugin(paginate);

// Export post model
const Like = mongoose.model('Like', likeSchema);
module.exports = Like;
