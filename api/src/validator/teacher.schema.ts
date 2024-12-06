import Joi from 'joi';

export const teacherRegistrationSchema = Joi.object({
  id: Joi.string().min(3).max(30).required().messages({
    'string.base': 'ID must be a string',
    'string.min': 'ID must be at least 3 characters long',
    'string.max': 'ID cannot be longer than 30 characters',
    'any.required': 'ID is required',
  }),

  firstName: Joi.string().min(3).max(50).required().messages({
    'string.base': 'First name must be a string',
    'string.min': 'First name must be at least 3 characters long',
    'string.max': 'First name cannot be longer than 50 characters',
    'any.required': 'First name is required',
  }),

  lastName: Joi.string().min(3).max(50).required().messages({
    'string.base': 'Last name must be a string',
    'string.min': 'Last name must be at least 3 characters long',
    'string.max': 'Last name cannot be longer than 50 characters',
    'any.required': 'Last name is required',
  }),

  password: Joi.string()
    .pattern(new RegExp('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d).{6,30}$')) // At least 1 lowercase, 1 uppercase, and 1 digit
    .required()
    .messages({
      'string.base': 'Password must be a string',
      'string.pattern.base':
        'Password must be between 6 and 30 characters long and contain at least one uppercase letter, one lowercase letter, and one number',
      'any.required': 'Password is required',
    }),

  role: Joi.string().valid('TEACHER').default('TEACHER').required().messages({
    'string.base': 'Role must be a string',
    'any.only': 'Role must be TEACHER',
    'any.required': 'Role is required',
  }),

  courses: Joi.array().items(Joi.string()).required().messages({
    'array.base': 'Courses must be an array of strings',
    'any.required': 'Courses are required',
  }),

  gender: Joi.string().valid('Male', 'Female').required().messages({
    'string.base': 'Gender must be a string',
    'any.only': 'Gender must be either Male or Female',
    'any.required': 'Gender is required',
  }),

  age: Joi.number().integer().min(18).required().messages({
    'number.base': 'Age must be a number',
    'number.min': 'Age must be at least 18',
    'any.required': 'Age is required',
  }),

  grades: Joi.array().items(Joi.string()).optional().messages({
    'array.base': 'Grades must be an array of strings',
  }),
});

export const teacherLoginSchema = Joi.object({
  id: Joi.string().required().messages({
    'any.required': 'ID is required',
  }),

  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
});

export const teacherUpdateSchema = Joi.object({
  firstName: Joi.string().min(3).max(50).required().messages({
    'string.base': 'First name must be a string',
    'string.min': 'First name must be at least 3 characters long',
    'string.max': 'First name cannot be longer than 50 characters',
    'any.required': 'First name is required',
  }),

  lastName: Joi.string().min(3).max(50).required().messages({
    'string.base': 'Last name must be a string',
    'string.min': 'Last name must be at least 3 characters long',
    'string.max': 'Last name cannot be longer than 50 characters',
    'any.required': 'Last name is required',
  }),

  password: Joi.string()
    .pattern(new RegExp('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d).{6,30}$')) // At least 1 lowercase, 1 uppercase, and 1 digit
    .required()
    .messages({
      'string.base': 'Password must be a string',
      'string.pattern.base':
        'Password must be between 6 and 30 characters long and contain at least one uppercase letter, one lowercase letter, and one number',
      'any.required': 'Password is required',
    }),

  role: Joi.string().valid('TEACHER').default('TEACHER').required().messages({
    'string.base': 'Role must be a string',
    'any.only': 'Role must be TEACHER',
    'any.required': 'Role is required',
  }),

  courses: Joi.array().items(Joi.string()).required().messages({
    'array.base': 'Courses must be an array of strings',
    'any.required': 'Courses are required',
  }),

  gender: Joi.string().valid('Male', 'Female').required().messages({
    'string.base': 'Gender must be a string',
    'any.only': 'Gender must be either Male or Female',
    'any.required': 'Gender is required',
  }),

  age: Joi.number().integer().min(18).required().messages({
    'number.base': 'Age must be a number',
    'number.min': 'Age must be at least 18',
    'any.required': 'Age is required',
  }),

  grades: Joi.array().items(Joi.string()).optional().messages({
    'array.base': 'Grades must be an array of strings',
  }),
});
