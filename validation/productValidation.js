import { check, body } from "express-validator";

export const validateProduct = [
  check("name").notEmpty().withMessage("Product name is required"),
  check("description").notEmpty().withMessage("Description cannot be empty"),
  check("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ gt: 0 })
    .withMessage("Price must be a number greater than 0"),
  check("category").notEmpty().withMessage("Category is required"),
  check("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 0 })
    .withMessage("Quantity must be a non-negative integer"),
  check("discountedPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Discounted price must be a number and it's >= 0"),
  check("brand").optional().isString().withMessage("Brand is string"),
  check("color").optional().isString().withMessage("Color is string"),
  check("numRatings")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Number of ratings must be a non-negative integer"),
  body("imageUrl")
    .optional()
    .isURL()
    .withMessage("Image URL must be a valid URL"),
  body("imageUrl").custom((value, { req }) => {
    if (!value && !req.file) {
      throw new Error("Either image URL or an image file is required");
    }
    return true;
  }),
];

export const validateProductId = [
  check("id")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Invalid Product ID"),
];

export const validateSearchProduct = [
  body().custom((value, { req }) => {
    const allowedFields = ["name", "categories", "minPrice", "maxPrice"];
    const hasAtLeastOneField = allowedFields.some((field) =>
      Object.keys(req.body).includes(field)
    );

    if (!hasAtLeastOneField) {
      throw new Error("At least one search parameter is required");
    }
    return true;
  }),
  check("name").optional().isString().withMessage("Name must be String"),
  check("categories")
    .optional()
    .isString()
    .withMessage("Categories must be String"),
  check("minPrice").optional().isInt().withMessage("minPrice must be Int"),
  check("maxPrice").optional().isInt().withMessage("maxPrice must be Int"),
];
