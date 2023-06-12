const httpStatus = require('http-status');
const { Comment } = require('../models');
const ApiError = require('../utils/ApiError');

const createComment = async (commentBody) => {
  return Comment.create(commentBody);
};

const getCommentByPostId = async (postId) => {
  const comments = await Comment.find({ post_id: postId }).sort({ createdAt: -1 });
  return comments;
};

const getCommentByUserId = async (userId) => {
  return Comment.findById(userId);
};

const getCommentById = async (commentId) => {
  return Comment.findById(commentId);
};

const updateCommentById = async (commentId, updateBody) => {
  const comment = await getCommentById(commentId);
  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
  }
  Object.assign(comment, updateBody);
  await comment.save();
  return comment;
};

const deleteCommentById = async (commentId) => {
  const comment = await getCommentById(commentId);
  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
  }
  await Comment.deleteOne({ _id: commentId });
  return comment;
};

const deleteCommentByPostId = async (postId) => {
  await Comment.remove({ post_id: postId });
};

const countComment = (postId) => {
  return Comment.count({ post_id: postId });
};

module.exports = {
  createComment,
  getCommentById,
  getCommentByPostId,
  getCommentByUserId,
  updateCommentById,
  deleteCommentById,
  deleteCommentByPostId,
  countComment,
};
