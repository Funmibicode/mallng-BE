import Joi from "joi";

// Schemas
const registerSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});


const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const productSchema = Joi.object({
  name: Joi.string().min(2).required(),
  category: Joi.string().required(),
  desc: Joi.string().required(),
  price: Joi.number().positive().required(),
});



// Middleware factory — takes a schema, returns middleware
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }
  next();
};






export { registerSchema, loginSchema, productSchema, validate };