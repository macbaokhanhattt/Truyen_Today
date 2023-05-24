const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createPost = {
  body: Joi.object().keys({
    subject: Joi.string().required(),
    content: Joi.string().required(),
    image: Joi.string(),
    category: Joi.string().required(),
    user_id: Joi.custom(objectId).required(),
    username: Joi.string().required(),
  }),
};

const getPosts = {
  query: Joi.object().keys({
    content: Joi.string(),
    subject: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getPost = {
  params: Joi.object().keys({
    postId: Joi.string().custom(objectId),
  }),
};

const updatePost = {
  params: Joi.object().keys({
    postId: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      subject: Joi.string(),
      content: Joi.string(),
      category: Joi.string(),
      image: Joi.string(),
    })
    .min(1),
};

const deletePost = {
  params: Joi.object().keys({
    postId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
};
