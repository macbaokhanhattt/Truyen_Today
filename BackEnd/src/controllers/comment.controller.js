const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { commentService, userService, postService} = require('../services');

const createComment = catchAsync(async (req, res) => {
  ///To check if a User_Id exists or not
  const checkUserIdExist = await userService.getUserById(req.body.user_id);
  if(!checkUserIdExist){
    throw new ApiError(400, 'User does not exist!');
  };
  ///To check if a Post exists or not
  const checkPostExist = await postService.getPostById(req.body.post_id);
  if(!checkPostExist){
    throw new ApiError(400, 'Post does not exist!');
  };

  ///Authorize If User Create Comment of other user
  if(req.user.id !== req.body.user_id){
    throw  new ApiError(400, 'Cannot create comment for other user');
  };

  const comment = await commentService.createComment(req.body);
  res.status(httpStatus.CREATED).send(comment);
});

const getCommentByPostId = catchAsync(async (req, res) => {
  const result = await commentService.getCommentByPostId(req.query.postId);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
  }
  res.send(result);
});

const getCommentByUserId = catchAsync(async (req, res) => {
  const result = await commentService.getCommentByUserId(req.params.userId)
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(result);
});

const updateCommentById = catchAsync(async (req, res) => {
  ///To check if a Comment exists or not
  const checkCommentExist = await commentService.getCommentById(req.params.commentId);
  if(!checkCommentExist){
    throw new ApiError(400, 'Comment does not exist!');
  };
  ///Authorize If User Update Comment of other User
  if(req.user.id !== checkCommentExist.user_id){
    throw  new ApiError(400, 'Cannot update comment of other user');
  };

  const comment = await commentService.updateCommentById(req.params.commentId, req.body);
  res.send(comment);
});

const deleteCommentById = catchAsync(async (req, res) => {
  ///To check if a Comment exists or not
  const checkCommentExist = await commentService.getCommentById(req.params.commentId);
  if(!checkCommentExist){
    throw new ApiError(400, 'Comment does not exist!');
  };
  ///Authorize If User Delete Comment of other User
  if(req.user.id !== checkCommentExist.user_id){
    throw  new ApiError(400, 'Cannot delete comment of other user');
  };


  await commentService.deleteCommentById(req.params.commentId);
  res.status(httpStatus.NO_CONTENT).send();
});

const deleteCommentByPostId = catchAsync( async (req, res) =>{
  //Bởi vì khi xóa Post ta phải xóa luôn những
  //Comment có trong Post đó khỏi Database
  ///To check if a Post exists or not
  const checkPostExist = await postService.getPostById(req.params.postId);
  if(!checkPostExist){
    throw new ApiError(400, 'Post does not exist!');
  };

  ///Authorize If User Update Post of other User
  if(req.user.id !== checkPostExist.user_id){
    throw  new ApiError(400, 'Cannot delete post of other user');
  };

  await commentService.deleteCommentByPostId(req.params.postId);
  res.status(httpStatus.NO_CONTENT).send();

}) ;


module.exports = {
  createComment,
  getCommentByUserId,
  getCommentByPostId,
  updateCommentById,
  deleteCommentByPostId,
  deleteCommentById,
};
