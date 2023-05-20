// Import necessary modules
const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

// Define post schema
const postSchema = mongoose.Schema({
  subject: {
    type: String,
  },
  content: {
    type: String,
  },
  image: {
    type: String
  },
  like_count: {
    type: Number
  },
  comment_count:{
    type: Number
  },
  category: {
    type: String,
  },
  user_id: {
    type: String,
    required: true
  },
});

// Apply plugins to schema
postSchema.plugin(toJSON);
postSchema.plugin(paginate);

// Export post model
const Post = mongoose.model('Post', postSchema);
module.exports = Post;
