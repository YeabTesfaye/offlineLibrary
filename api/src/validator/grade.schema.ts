import Joi from 'joi';

export const gradeRegistrationSchema = Joi.object({
  id: Joi.string()
    .trim()
    .required()
    .messages({
      'string.empty': 'Grade ID is required.',
      'any.required': 'Grade ID is required.',
    }),
  name: Joi.string()
    .trim()
    .required()
    .messages({
      'string.empty': 'Grade name is required.',
      'any.required': 'Grade name is required.',
    }),
  teachers: Joi.array()
    .items(
      Joi.string().trim().required().messages({
        'string.empty': 'Each teacher ID must be a valid string.',
      })
    )
    .default([])
    .messages({
      'array.base': 'Teachers should be an array of teacher IDs.',
    }),
});
