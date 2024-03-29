const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const commentValidation = require('../../validations/comment.validation');
const commentController = require('../../controllers/comment.controller');
const {ro} = require("faker/lib/locales");

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(commentValidation.createComment), commentController.createComment)
  .get(auth(), validate(commentValidation.getCommentByUserId), commentController.getCommentByUserId);

router
  .route('/:commentId')
  .put(auth(), validate(commentValidation.updateComment), commentController.updateCommentById)
  .delete(auth(), validate(commentValidation.deleteComment), commentController.deleteCommentById);

router.route('/:postId').get(validate(commentValidation.getCommentByPostId), commentController.getCommentByPostId);

router.route('/getcomment/:commentId').get(validate(commentValidation.getComment), commentController.getCommentById);

module.exports = router;
