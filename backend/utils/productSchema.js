/**
 * Eyewear E-commerce Product Schema Documentation
 * 
 * This file documents the product schema and available fields for 
 * the eyewear e-commerce platform.
 */

/**
 * Product Categories
 * 
 * The main product categories in the eyewear store.
 * @type {string[]}
 */
export const PRODUCT_CATEGORIES = [
  'Eyeglasses',
  'Sunglasses',
  'Contact Lenses'
];

/**
 * Product Sub-Categories
 * 
 * Sub-categories organized by the main product categories.
 * @type {Object.<string, string[]>}
 */
export const PRODUCT_SUBCATEGORIES = {
  'Eyeglasses': ['Men', 'Women', 'Kids', 'Unisex'],
  'Sunglasses': ['Men', 'Women', 'Kids', 'Unisex'],
  'Contact Lenses': ['Daily', 'Weekly', 'Monthly', 'Colored', 'Toric']
};

/**
 * Frame Shapes
 * 
 * Available frame shapes for eyeglasses and sunglasses.
 * @type {string[]}
 */
export const FRAME_SHAPES = [
  'Rectangle', 'Square', 'Round', 'Oval', 'Cat Eye',
  'Aviator', 'Browline', 'Geometric', 'Rimless', 'Semi-Rimless'
];

/**
 * Frame Materials
 * 
 * Available frame materials for eyeglasses and sunglasses.
 * @type {string[]}
 */
export const FRAME_MATERIALS = [
  'Metal', 'Plastic', 'Acetate', 'Titanium', 'Stainless Steel',
  'Memory Metal', 'Carbon Fiber', 'Wood', 'Mixed Material'
];

/**
 * Lens Types
 * 
 * Available lens types organized by product category.
 * @type {Object.<string, string[]>}
 */
export const LENS_TYPES = {
  'Eyeglasses': [
    'Single Vision', 'Bifocal', 'Progressive', 
    'Blue Light Blocking', 'Reading', 'Non-Prescription'
  ],
  'Sunglasses': [
    'Standard Tint', 'Polarized', 'Mirror Coating', 
    'Gradient Tint', 'Photochromic', 'Non-Prescription'
  ],
  'Contact Lenses': [
    'Daily Disposable', 'Weekly Disposable', 'Monthly Disposable',
    'Extended Wear', 'Colored Contacts', 'Toric (for Astigmatism)',
    'Multifocal', 'Rigid Gas Permeable (RGP)'
  ]
};

/**
 * Prescription Requirement Options
 * 
 * Options for whether a product requires a prescription.
 * @type {Array.<{value: string, label: string}>}
 */
export const PRESCRIPTION_REQUIRED_OPTIONS = [
  { value: "none", label: "Not Required" },
  { value: "optional", label: "Optional" },
  { value: "required", label: "Required" }
];

/**
 * Prescription Type Options
 * 
 * Types of prescription forms that can be associated with products.
 * @type {Array.<{value: string, label: string}>}
 */
export const PRESCRIPTION_TYPE_OPTIONS = [
  { value: "none", label: "None" },
  { value: "eyeglasses", label: "Eyeglasses" },
  { value: "prescription_sunglasses", label: "Prescription Sunglasses" },
  { value: "contacts", label: "Contact Lenses" }
];

/**
 * Size Options
 * 
 * Size options organized by product category.
 * @type {Object.<string, string[]>}
 */
export const SIZE_OPTIONS = {
  'Eyeglasses': ["Small", "Medium", "Large", "X-Large"],
  'Sunglasses': ["Small", "Medium", "Large", "X-Large"],
  'Contact Lenses': ["14.0", "14.2", "14.5"]
};

/**
 * Product Schema
 * 
 * The complete product schema with all available fields.
 * @type {Object}
 */
export const PRODUCT_SCHEMA = {
  name: {
    type: "String",
    required: true,
    description: "Product name"
  },
  description: {
    type: "String",
    required: true,
    description: "Product description"
  },
  price: {
    type: "Number",
    required: true,
    description: "Product price"
  },
  image: {
    type: "Array",
    required: true,
    description: "Array of image URLs"
  },
  imageDetails: {
    type: "Array",
    description: "Array of detailed image metadata"
  },
  category: {
    type: "String",
    required: true,
    enum: PRODUCT_CATEGORIES,
    description: "Product category"
  },
  subCategory: {
    type: "String",
    required: true,
    description: "Product sub-category (e.g., Men, Women, Kids)"
  },
  brand: {
    type: "String",
    default: "",
    description: "Product brand"
  },
  frameShape: {
    type: "String",
    default: "",
    enum: FRAME_SHAPES,
    description: "Frame shape (for eyeglasses and sunglasses)"
  },
  frameMaterial: {
    type: "String",
    default: "",
    enum: FRAME_MATERIALS,
    description: "Frame material (for eyeglasses and sunglasses)"
  },
  frameColor: {
    type: "String",
    default: "",
    description: "Frame color"
  },
  lensType: {
    type: "String",
    default: "",
    description: "Type of lens"
  },
  prescription: {
    type: "Boolean",
    default: false,
    description: "Whether the product can be ordered with prescription"
  },
  prescriptionRequired: {
    type: "String",
    enum: ["none", "optional", "required"],
    default: "none",
    description: "Whether prescription is required for this product"
  },
  prescriptionType: {
    type: "String",
    enum: ["eyeglasses", "prescription_sunglasses", "contacts", "none"],
    default: "none",
    description: "Type of prescription entry form to show"
  },
  sizes: {
    type: "Array",
    required: true,
    description: "Available sizes"
  },
  bestseller: {
    type: "Boolean",
    required: true,
    description: "Whether the product is a bestseller"
  },
  sku: {
    type: "String",
    description: "Stock Keeping Unit for inventory management"
  },
  date: {
    type: "Number",
    required: true,
    description: "Date added (timestamp)"
  }
};

export default {
  PRODUCT_CATEGORIES,
  PRODUCT_SUBCATEGORIES,
  FRAME_SHAPES,
  FRAME_MATERIALS,
  LENS_TYPES,
  PRESCRIPTION_REQUIRED_OPTIONS,
  PRESCRIPTION_TYPE_OPTIONS,
  SIZE_OPTIONS,
  PRODUCT_SCHEMA
};
