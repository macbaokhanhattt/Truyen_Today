const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { postService, userService, commentService, likeService } = require('../services');
const { getPostById } = require('../services/post.service');

const createPost = catchAsync(async (req, res) => {
  /// To check if a User_Id exists or not
  const checkUserIdExist = await userService.getUserById(req.body.user_id);
  if (!checkUserIdExist) {
    throw new ApiError(400, 'User does not exist!');
  }

  /// Authorize If User Create Post with his Id or not
  if (req.user.id !== req.body.user_id) {
    throw new ApiError(400, 'Cannot create post for other user');
  }

  /// create Post
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

const getPostByUserId = catchAsync(async (req, res) => {});

const updatePost = catchAsync(async (req, res) => {
  /// To check if a Post exists or not
  const checkPostExist = await postService.getPostById(req.params.postId);
  if (!checkPostExist) {
    throw new ApiError(400, 'Post does not exist!');
  }
  /// Authorize If User Update Post of other User
  if (req.user.id !== checkPostExist.user_id) {
    throw new ApiError(400, 'Cannot update post of other user');
  }

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

const increaseLike = catchAsync(async (req, res) => {
  /// check liked => if liked => false
  const likeStatus = await likeService.getPostLikeStatus(req.params.postId, req.user.id);
  if (likeStatus.isLike === 1) {
    throw new ApiError(400, 'This Post Already Liked by this user');
  }
  const result = await postService.getPostById(req.params.postId);
  const updateBody = {
    like_count: result.like_count + 1,
    interaction_count: result.interaction_count + 1,
    interact: result.interaction_count + 1,
  };
  await postService.updatePostById(req.params.postId, updateBody);
  await likeService.updateLikeTracking(req.params.postId, req.user.id, { isLike: 1 });
  res.status(200).send();
});

const decreaseLike = catchAsync(async (req, res) => {
  /// check liked => if unliked => false
  const likeStatus = await likeService.getPostLikeStatus(req.params.postId, req.user.id);
  if (likeStatus.isLike === 0) {
    throw new ApiError(400, 'This Post Didnt Liked by this user');
  }
  const result = await postService.getPostById(req.params.postId);
  const updateBody = {
    like_count: result.like_count - 1,
    interaction_count: result.interaction_count - 1,
    interact: result.interaction_count - 1,
  };
  await postService.updatePostById(req.params.postId, updateBody);
  await likeService.updateLikeTracking(req.params.postId, req.user.id, { isLike: 0 });
  res.status(200).send();
});

const checkLikeStatus = catchAsync(async (req, res) => {
  const post = await likeService.getPostLikeStatus(req.params.postId, req.user.id);
  const checkLike = post.isLike;
  res.send({
    isLike: checkLike,
  });
});

const createLikeTracking = catchAsync(async (req, res) => {
  const result = await likeService.createLikeTracking(req.params.postId, req.user.id);
  res.status(200).send();
});

module.exports = {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  increaseLike,
  decreaseLike,
  checkLikeStatus,
  createLikeTracking,
};
