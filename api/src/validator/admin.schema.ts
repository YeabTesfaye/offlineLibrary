import Joi from 'joi';

export const adminRegistrationSchema = Joi.object({
  id: Joi.string().required().messages({
    'string.empty': 'Admin ID is required.',
    'any.required': 'Admin ID is required.',
  }),
  firstName: Joi.string().min(2).max(50).required().messages({
    'string.empty': 'First name is required.',
    'string.min': 'First name must be at least 2 characters.',
    'string.max': 'First name must not exceed 50 characters.',
    'any.required': 'First name is required.',
  }),
  lastName: Joi.string().min(2).max(50).required().messages({
    'string.empty': 'Last name is required.',
    'string.min': 'Last name must be at least 2 characters.',
    'string.max': 'Last name must not exceed 50 characters.',
    'any.required': 'Last name is required.',
  }),
  password: Joi.string()
    .pattern(new RegExp('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)[A-Za-z\\d]{6,30}$'))
    .required()
    .messages({
      'string.base': 'Password must be a string',
      'string.pattern.base':
        'Password must be 6-30 characters long, include at least one uppercase letter, one lowercase letter, and one digit. Special characters are not allowed.',
      'any.required': 'Password is required',
    }),
  role: Joi.string().valid('ADMIN').default('ADMIN').messages({
    'any.only': 'Role must be ADMIN.',
  }),
});
