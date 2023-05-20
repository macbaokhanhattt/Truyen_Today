const httpStatus = require('http-status');
const { Comment } = require('../models');
const ApiError = require('../utils/ApiError');

const createComment = async (commentBody) => {
  return Comment.create(commentBody);
};

const getCommentByPostId = async (filter, options) => {
  const comment = await Comment.find({post_id : filter} );
  return comment;
};

const getCommentByUserId = async (userId) => {
  return Comment.findById(userId);
};

const getCommentById = async (commentId) =>{
  return Comment.findById(commentId);
};

const updateCommentById = async (commentId, updateBody) => {
  const comment = await getCommentById(commentId);
  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
  }
  Object.assign(comment, updateBody);
  await Comment.save();
  return comment;
};

const deleteCommentById = async (commentId) => {
  const comment = await getCommentById(commentId);
  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
  }
  await Comment.remove();
  return comment;
};

const deleteCommentByPostId = async (postId) =>{
  await Comment.remove({postId});
};

module.exports = {
  createComment,
  getCommentById,
  getCommentByPostId,
  getCommentByUserId,
  updateCommentById,
  deleteCommentById,
  deleteCommentByPostId,
};
