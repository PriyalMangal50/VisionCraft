import mongoose from "mongoose";

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true,
  },
  answer: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      'General',
      'Eyeglasses',
      'Sunglasses',
      'Contact Lenses',
      'Prescription',
      'Size &amp; Fit',
      'Orders',
      'Shipping',
      'Returns',
      'Payment',
      'Products'
    ],
    default: 'General'
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const faqModel = mongoose.model("FAQ", faqSchema);

export default faqModel;
