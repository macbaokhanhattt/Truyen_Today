// Import necessary modules
const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

// Define post schema
const commentSchema = mongoose.Schema({
  content :{
    type: String,
    required: true,
  },
  post_id :{
    type: String,
    required: true,
  },
  user_id :{
    type: String,
  }
});

// Apply plugins to schema
commentSchema.plugin(toJSON);
commentSchema.plugin(paginate);

// Export post model
const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
