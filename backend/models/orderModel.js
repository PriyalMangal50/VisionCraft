import mongoose from 'mongoose' 

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

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  prescription: {
    type: prescriptionSchema,
    default: null,
  },
  size: {
    type: String,
    default: "",
  },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  items: {
    type: [orderItemSchema],
    required: true,
  },
  address: {
    type: Object,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "Order Placed",
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  payment: {
    type: Boolean,
    required: true,
    default: false,
  },
  date: {
    type: Number,
    required: true,
  },
});

const orderModel = mongoose.models.order || mongoose.model('order',orderSchema);

export default orderModel;
