import mongoose from "mongoose";

// Schema for prescription details
const prescriptionSchema = new mongoose.Schema({
  // For eyeglasses and sunglasses
  rightEye: {
    sphere: { type: Number, default: null }, // SPH value
    cylinder: { type: Number, default: null }, // CYL value
    axis: { type: Number, default: null }, // Axis value
    add: { type: Number, default: null }, // Add value for bifocals/progressives
  },
  leftEye: {
    sphere: { type: Number, default: null }, // SPH value
    cylinder: { type: Number, default: null }, // CYL value
    axis: { type: Number, default: null }, // Axis value
    add: { type: Number, default: null }, // Add value for bifocals/progressives
  },
  pd: { type: Number, default: null }, // Pupillary Distance

  // For contact lenses
  baseCurve: { type: Number, default: null }, // Base Curve (BC)
  diameter: { type: Number, default: null }, // Diameter (DIA)
  power: { type: Number, default: null }, // Power value
  
  // Common fields
  notes: { type: String, default: "" }, // Additional notes from customer
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  price: {
    type: Number,
    default: 0,
  },
  image: {
    type: Array,
    default: [],
  },
  // Comprehensive image metadata storage
  imageDetails: {
    type: Array,
    default: []
  },
  // SKU (Stock Keeping Unit) for professional inventory management
  sku: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  category: {
    type: String,
    default: "",
    // Eyeglasses, Sunglasses, Contact Lenses
  },
  subCategory: {
    type: String,
    default: "",
    // For eyeglasses/sunglasses: Men, Women, Kids, Unisex
    // For contact lenses: Daily, Weekly, Monthly, Colored, etc.
  },
  brand: {
    type: String,
    default: "",
  },
  frameShape: {
    type: String,
    default: "",
    // Rectangle, Square, Round, Cat Eye, Aviator, etc.
  },
  frameMaterial: {
    type: String,
    default: "",
    // Metal, Plastic, Acetate, Titanium, etc.
  },
  frameColor: {
    type: String,
    default: "",
  },
  lensType: {
    type: String,
    default: "",
    // Single Vision, Bifocal, Progressive, Blue Light, Photochromic, etc.
  },
  sizes: {
    type: Array,
    default: [],
    // For eyewear: includes frame width, temple length, lens height, etc.
  },
  prescription: {
    type: Boolean,
    default: false,
    // Whether the product can be ordered with prescription
  },
  prescriptionRequired: {
    type: String,
    enum: ['none', 'optional', 'required'],
    default: 'none',
    // none: No prescription needed (non-prescription sunglasses)
    // optional: Can be ordered with or without prescription (eyeglasses, prescription sunglasses)
    // required: Must be ordered with prescription (contact lenses)
  },
  prescriptionType: {
    type: String,
    enum: ['eyeglasses', 'prescription_sunglasses', 'contacts', 'none'],
    default: 'none',
    // Determines which prescription entry form to show
  },
  bestseller: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Number,
    default: () => Date.now(),
  },
  // Batch ID for tracking which import batch this product belongs to
  batchId: {
    type: String,
    index: true,
    default: null
  },
  // Source file name for tracking which file this product was imported from
  sourceFile: {
    type: String,
    default: null
  },
  // Fields for frame finder quiz
  suitableFaceShapes: {
    type: [String],
    default: [],
    // Face shapes this frame complements: oval, round, square, heart, diamond
  },
  usage: {
    type: [String],
    default: [],
    // What activities the frame is suited for: everyday, computer, reading, fashion, sports
  },
  features: {
    blueLight: { type: Boolean, default: false },
    lightweight: { type: Boolean, default: false },
    polarized: { type: Boolean, default: false },
    transition: { type: Boolean, default: false }
  },
  quizRelevanceScore: {
    type: Number,
    default: 0,
    // Used for sorting quiz results, higher = more prominent in results
  },
});

const productModel = mongoose.models.product || mongoose.model("product",productSchema)

export default productModel
