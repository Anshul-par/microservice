import Joi from "joi";

export const ticket_creation_validate = {
  body: Joi.object()
    .keys({
      title: Joi.string().min(3).max(100).required(),
      price: Joi.number().required(),
    })
    .required(),
};
export const ticket_update_validate = {
  params: Joi.object()
    .keys({
      id: Joi.string().required(),
    })
    .required(),
  body: Joi.object()
    .keys({
      title: Joi.string().min(3).max(100).optional(),
      price: Joi.number().optional(),
    })
    .required(),
};

export const param_id_validate = {
  params: Joi.object()
    .keys({
      id: Joi.string().required(),
    })
    .required(),
};
