const Joi = require("joi");

//Register validation

const registerValidation = (data) => {
  const userSchema = Joi.object({
    role: Joi.number(),
    profile_pic: Joi.number().required(),
    username: Joi.string().min(3).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });
  return userSchema.validate(data);
};

const loginValidation = (data) => {
  const userSchema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });
  return userSchema.validate(data);
};

const streamValidation = (data) => {
  const streamSchema = Joi.object({
    user_id: Joi.number().required(),
    category_id: Joi.number().required(),
    room_id: Joi.number().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    iframe: Joi.string().required(),
  });
  return streamSchema.validate(data);
};

const videoValidation = (data) => {
  const videoSchema = Joi.object({
    user_id: Joi.number().required(),
    category_id: Joi.number().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    iframe: Joi.string().required(),
  });
  return videoSchema.validate(data);
};

const updateValidation = (data) => {
  const updateSchema = Joi.object({
    username: Joi.string().min(3).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
    profile_pic: Joi.number().required(),
  });
  return updateSchema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.streamValidation = streamValidation;
module.exports.videoValidation = videoValidation;
module.exports.updateValidation = updateValidation;
