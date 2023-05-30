const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createComment = {
  body: Joi.object().keys({
    content: Joi.string().required(),
    post_id : Joi.string().required(),
    user_id: Joi.string().required(),
  }),
};

const getComments = {
  query: Joi.object().keys({
    post_id: Joi.string(),
    user_id: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getCommentByPostId = {
  params: Joi.object().keys({
    postId: Joi.string().required().custom(objectId),
  }),
};

const getCommentByUserId = {
  query: Joi.object().keys({
    userId: Joi.string().required().custom(objectId),
  })
};

const getComment = {
  params: Joi.object().keys({
    commentId: Joi.string().custom(objectId),
  }),
};

const updateComment = {
  params: Joi.object().keys({
    commentId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      content: Joi.string().required(),
    })
    .min(1),
};

const deleteComment = {
  params: Joi.object().keys({
    commentId: Joi.string().custom(objectId),
  }),
};

const deleteCommentByPostId = {
  query: Joi.object().keys({
    postId: Joi.string().custom(objectId),
  })
};

module.exports = {
  createComment,
  getComments,
  getComment,
  getCommentByPostId,
  getCommentByUserId,
  updateComment,
  deleteComment,
  deleteCommentByPostId,
};
