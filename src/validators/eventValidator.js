const Joi = require('joi');

const createEventSchema = (data) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    date: Joi.date().greater('now').required(), // Prevent past events 
    ticketPrice: Joi.number().min(0).required(),
    totalSeats: Joi.number().integer().min(1).required(),
    status: Joi.string().valid('draft', 'published', 'cancelled').default('published')
  });
  return schema.validate(data);
};

module.exports = { createEventSchema };