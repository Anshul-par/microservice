import Joi from "joi";

export const order_creation_validate = {
  body: Joi.object()
    .keys({
      ticketId: Joi.string().required(),
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
