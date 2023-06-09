const httpStatus = require('http-status');
const { Like } = require('../models');
const ApiError = require('../utils/ApiError');

const getPostLikeStatus = (postId, userId) => {
  return Like.findOne({ post_id: postId, user_id: userId });
};

const createLikeTracking = (postId, userId) => {
  return Like.create({
    post_id: postId,
    user_id: userId,
  });
};

const updateLikeTracking = async (postId, userId, updateBody) => {
  const like = await getPostLikeStatus(postId, userId);
  if (!like) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post Like not found');
  }
  Object.assign(like, updateBody);
  like.save();
  return like;
};

module.exports = {
  getPostLikeStatus,
  createLikeTracking,
  updateLikeTracking,
};
