import mongoose from "mongoose";

const quizResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    // Will be null for guest users
  },
  sessionId: {
    type: String,
    required: true,
    // Browser session ID for tracking guest users
  },
  answers: {
    faceShape: {
      type: String,
      enum: ['oval', 'round', 'square', 'heart', 'diamond'],
    },
    frameStyle: {
      type: String,
    },
    usage: {
      type: String,
    },
    features: {
      type: [String],
      default: [],
    }
  },
  recommendedProducts: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'product',
    },
    score: {
      type: Number,
      default: 0,
    }
  }],
  clicked: {
    type: Boolean,
    default: false,
    // Whether the user clicked on any recommended products
  },
  purchased: {
    type: Boolean,
    default: false,
    // Whether the user purchased any recommended products
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const quizModel = mongoose.models.quiz || mongoose.model("quiz", quizResultSchema);

export default quizModel;
