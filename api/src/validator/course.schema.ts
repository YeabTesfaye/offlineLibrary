import Joi from 'joi';

export const courseRegistrationSchema = Joi.object({
  courseCode: Joi.string().alphanum().min(3).max(30).required().messages({
    'string.base': 'Course code must be a string',
    'string.empty': 'Course code is required',
    'string.min': 'Course code must be at least 3 characters',
    'string.max': 'Course code must be at most 30 characters',
    'any.required': 'Course code is required',
  }),
  courseName: Joi.string().min(3).max(50).required().messages({
    'string.base': 'Course name must be a string',
    'string.empty': 'Course name is required',
    'string.min': 'Course name must be at least 3 characters',
    'string.max': 'Course name must be at most 50 characters',
    'any.required': 'Course name is required',
  }),
  description: Joi.string().max(255).allow(null, '').messages({
    'string.base': 'Description must be a string',
    'string.max': 'Description must be at most 255 characters',
  }),
  instructorId: Joi.string().alphanum().min(3).max(30).messages({
    'string.base': 'Instructor ID must be a string',
    'string.empty': 'Instructor ID is required',
    'string.min': 'Instructor ID must be at least 3 characters',
    'string.max': 'Instructor ID must be at most 30 characters',
  }),
  // content: Joi.string().required().messages({
  //   'string.base': 'Content  must be a string',
  //   'any.required': 'Content is required is required',
  // }),
  contentType: Joi.string()
    .valid('video', 'document', 'image', 'audio')
    .allow(null, '')
    .messages({
      'string.base': 'Content type must be a string',
      'any.only': 'Content type must be one of [video, document, image, audio]',
    }),
});


export const courseUpdateSchema = Joi.object({
  courseCode: Joi.string().alphanum().min(3).max(30).messages({
    'string.base': 'Course code must be a string',
    'string.min': 'Course code must be at least 3 characters',
    'string.max': 'Course code must be at most 30 characters',
  }),
  courseName: Joi.string().min(3).max(50).required().messages({
    'string.base': 'Course name must be a string',
    'string.empty': 'Course name is required',
    'string.min': 'Course name must be at least 3 characters',
    'string.max': 'Course name must be at most 50 characters',
    'any.required': 'Course name is required',
  }),
  description: Joi.string().max(255).allow(null, '').messages({
    'string.base': 'Description must be a string',
    'string.max': 'Description must be at most 255 characters',
  }),
  instructorId: Joi.string().alphanum().min(3).max(30).messages({
    'string.base': 'Instructor ID must be a string',
    'string.empty': 'Instructor ID is required',
    'string.min': 'Instructor ID must be at least 3 characters',
    'string.max': 'Instructor ID must be at most 30 characters',
  }),
  // content: Joi.string().required().messages({
  //   'string.base': 'Content  must be a string',
  //   'any.required': 'Content is required is required',
  // }),
  contentType: Joi.string()
    .valid('video', 'document', 'image', 'audio')
    .allow(null, '')
    .messages({
      'string.base': 'Content type must be a string',
      'any.only': 'Content type must be one of [video, document, image, audio]',
    }),
});