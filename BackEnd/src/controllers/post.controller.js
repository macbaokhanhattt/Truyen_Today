const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { postService, userService, commentService} = require('../services');
const {getPostById} = require("../services/post.service");


const createPost = catchAsync(async (req, res) => {
  ///To check if a User_Id exists or not
  const checkUserIdExist = await userService.getUserById(req.body.user_id);
  if(!checkUserIdExist){
    throw new ApiError(400, 'User does not exist!');
  };

  ///Authorize If User Create Post with his Id or not
  if (req.user.id !== req.body.user_id){
    throw new ApiError(400, 'Cannot create post for other user');
  };

  ///create Post
  const post = await postService.createPost(req.body);
  res.status(httpStatus.CREATED).send(post);
});

const getPosts = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['category']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await postService.queryPosts(filter, options);
  res.send(result);
});

const getPost = catchAsync(async (req, res) => {
  const post = await postService.getPostById(req.params.postId);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
  }
  res.send(post);
});

const getPostByUserId = catchAsync(async  (req, res) =>{

});

const updatePost = catchAsync(async (req, res) => {
  ///To check if a Post exists or not
  const checkPostExist = await postService.getPostById(req.params.postId);
  if(!checkPostExist){
    throw new ApiError(400, 'Post does not exist!');
  };
  console.log(checkPostExist);
  ///Authorize If User Update Post of other User
  if(req.user.id !== checkPostExist.user_id){
    throw  new ApiError(400, 'Cannot update post of other user');
  };

  const post = await postService.updatePostById(req.params.postId, req.body);
  res.send(post);
});

const deletePost = catchAsync(async (req, res) => {
  /// To check if a Post exists or not
  const checkPostExist = await postService.getPostById(req.params.postId);
  if (!checkPostExist) {
    throw new ApiError(400, 'Post does not exist!');
  }

  /// Authorize If User Update Post of other User
  if (req.user.id !== checkPostExist.user_id) {
    throw new ApiError(400, 'Cannot delete post of other user');
  }

  await commentService.deleteCommentByPostId(req.params.postId);
  await postService.deletePostById(req.params.postId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
};
