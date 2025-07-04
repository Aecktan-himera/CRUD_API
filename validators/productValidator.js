const { body, validationResult } = require('express-validator');

// Правила для создания продукта (все поля обязательны)
const createProductValidationRules = () => [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be 0 or more'),
  body('category').trim().notEmpty().withMessage('Category is required')
];

// Правила для обновления продукта (все поля опциональны)
const updateProductValidationRules = () => [
  body('name').optional().trim().notEmpty().withMessage('Name is required'),
  body('price').optional().isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
  body('quantity').optional().isInt({ min: 0 }).withMessage('Quantity must be 0 or more'),
  body('category').optional().trim().notEmpty().withMessage('Category is required')
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
};

exports.createProductValidationRules = createProductValidationRules;
exports.updateProductValidationRules = updateProductValidationRules;
exports.validate = validate;