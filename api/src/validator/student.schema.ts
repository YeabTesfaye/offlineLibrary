import Joi from 'joi';

export const studentRegisterSchema = Joi.object({
  id: Joi.string().min(3).max(30).required().messages({
    'string.min': 'Student ID must be at least 3 characters long',
    'string.max': 'Student ID must not exceed 30 characters',
    'any.required': 'Student ID is required',
  }),
  firstName: Joi.string().min(3).max(30).required().messages({
    'string.min': 'First Name must be at least 3 characters long',
    'string.max': 'First Name must not exceed 30 characters',
    'any.required': 'First Name is required',
  }),
  lastName: Joi.string().min(3).max(30).required().messages({
    'string.min': 'Last Name must be at least 3 characters long',
    'string.max': 'Last Name must not exceed 30 characters',
    'any.required': 'Last Name is required',
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

  age: Joi.number().integer().min(7).required().messages({
    'number.base': 'Age must be a number',
    'number.min': 'Age must be at least 7 years old',
    'any.required': 'Age is required',
  }),
  grade: Joi.number().integer().required().messages({
    'number.base': 'Grade must be a number',
    'any.required': 'Grade is required',
  }),
  gender: Joi.string().valid('Male', 'Female').required().messages({
    'any.only': 'Gender must be either Male or Female',
    'any.required': 'Gender is required',
  }),
  role: Joi.string()
    .valid('STUDENT', 'TEACHER', 'ADMIN')
    .default('STUDENT')
    .messages({
      'string.base': 'Role must be a string',
      'any.only': 'Role must be one of STUDENT, TEACHER, or ADMIN',
    }),
});

export const studentLoginSchema = Joi.object({
  id: Joi.string().required().messages({
    'string.empty': 'Student ID is required',
  }),
  password: Joi.string()
    .required()
    .messages({
      'string.empty': 'Password is required',
    }),
});


export const studentUpdateSchema = Joi.object({
  firstName: Joi.string().min(3).max(30).required().messages({
    'string.min': 'First Name must be at least 3 characters long',
    'string.max': 'First Name must not exceed 30 characters',
    'any.required': 'First Name is required',
  }),
  lastName: Joi.string().min(3).max(30).required().messages({
    'string.min': 'Last Name must be at least 3 characters long',
    'string.max': 'Last Name must not exceed 30 characters',
    'any.required': 'Last Name is required',
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

  age: Joi.number().integer().min(7).required().messages({
    'number.base': 'Age must be a number',
    'number.min': 'Age must be at least 7 years old',
    'any.required': 'Age is required',
  }),
  grade: Joi.number().integer().required().messages({
    'number.base': 'Grade must be a number',
    'any.required': 'Grade is required',
  }),
  gender: Joi.string().valid('Male', 'Female').required().messages({
    'any.only': 'Gender must be either Male or Female',
    'any.required': 'Gender is required',
  }),
  role: Joi.string()
    .valid('STUDENT', 'TEACHER', 'ADMIN')
    .default('STUDENT')
    .messages({
      'string.base': 'Role must be a string',
      'any.only': 'Role must be one of STUDENT, TEACHER, or ADMIN',
    }),
});