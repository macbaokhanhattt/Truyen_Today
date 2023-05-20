const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const postValidation = require('../../validations/post.validation');
const postController = require('../../controllers/post.controller');

const router = express.Router();

router
  .route('/')
  .get(validate(postValidation.getPosts),postController.getPosts)
  .post(auth(),validate(postValidation.createPost),postController.createPost)

router
  .route('/:postId')
  .get(validate(postValidation.getPost), postController.getPost)
  .put(auth(), validate(postValidation.updatePost),postController.updatePost)
  .delete(auth(), validate(postValidation.deletePost), postController.deletePost)

module.exports = router;


