import Joi from "joi";

export const signin_validate = {
  body: Joi.object()
    .keys({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(30).required(),
    })
    .required(),
};
export const signup_validate = {
  body: Joi.object()
    .keys({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(30).required(),
    })
    .required(),
};
