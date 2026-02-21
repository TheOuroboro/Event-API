const Joi = require('joi');

const createBookingSchema = (data) => {
  const schema = Joi.object({
    eventId: Joi.string().required(), // The ID of the event being booked
    quantity: Joi.number().integer().min(1).required()
  });
  return schema.validate(data);
};

module.exports = { createBookingSchema };