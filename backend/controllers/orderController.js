import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import quizModel from "../models/quizModel.js";
import Stripe from "stripe";

const currency = "inr";
const delivery_charge = 49;

//GATEWAY INITIALIZE
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


//order using COD
const placeOrder = async (req, res, next) => {
  try {
    const { userId, address, amount, items } = req.body;

    // Items might contain prescription information now
    const orderData = {
      items,
      address,
      amount,
      userId,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData)
    await newOrder.save()

    await userModel.findByIdAndUpdate(userId, { cartData: {} });
    
    // Track quiz conversion if there's an active quiz
    const { quizId } = req.body;
    if (quizId) {
      await quizModel.findByIdAndUpdate(quizId, { purchased: true });
    }

    res.json({success:true , message: "Order Placed"}) 
  } catch (error) {
    console.log(error);
    res.json({success:false,message:error.message})
    
  }
};

//place order using stripe
const placeOrderStripe = async (req, res, next) => {
  try {
    const { userId, address, amount, items } = req.body;
    const { origin } = req.headers;
    
    // Items might contain prescription information now
    const orderData = {
      items,
      address,
      amount,
      userId,
      paymentMethod: "stripe",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData)
    await newOrder.save()

    // For stripe, we need to create line items without prescription data
    const line_items = items.map((item) => {
      // Add prescription info to metadata for reference
      const metadata = {};
      
      if (item.prescription) {
        // Simplify prescription data for the metadata
        if (item.prescription.rightEye) {
          metadata.rightEyeSphere = item.prescription.rightEye.sphere;
          metadata.rightEyeCylinder = item.prescription.rightEye.cylinder;
          metadata.rightEyeAxis = item.prescription.rightEye.axis;
        }
        if (item.prescription.leftEye) {
          metadata.leftEyeSphere = item.prescription.leftEye.sphere;
          metadata.leftEyeCylinder = item.prescription.leftEye.cylinder;
          metadata.leftEyeAxis = item.prescription.leftEye.axis;
        }
        if (item.prescription.pd) metadata.pd = item.prescription.pd;
        if (item.prescription.baseCurve) metadata.baseCurve = item.prescription.baseCurve;
        if (item.prescription.diameter) metadata.diameter = item.prescription.diameter;
      }
      
      return {
        price_data: {
          currency: currency,
          product_data: {
            name: item.name,
            metadata: metadata
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      };
    });

    line_items.push({
      price_data: {
        currency: currency,
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: delivery_charge *100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({success:false,message:error.message})
  }
};


//place order using razorpay
const placeOrderRazorpay = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

//All orders for admin panel
const allOrders = async (req, res, next) => {
  try {
    const orders = await orderModel.find({});
    res.json({success:true,orders})
  } catch (error) {
    console.log(error);
    res.json({success:false,message: error.message})
  }
};
//user order data for frontend
const userOrders = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId });
    res.json({success:true,orders})
  } catch (error) {
    console.log(error);
    res.json({success:false,message: error.message})
    
  }
};


//update order status from admin panel
const updateStatus = async (req, res, next) => {
  try {
    const { orderId, status } = req.body;

    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({success:true,message:"Status updated"})
  } catch (error) {
    console.log(error);
    res.json({success:false,message: error.message})
  }
};


//Verify stripe payment
const verifyStripePayment = async (req, res, next) => {
  try {
    const { orderId, success, userId } = req.body;

    if (success === "true") {
      await orderModel.findByIdAndUpdate( orderId,{ payment: true });
      await userModel.findByIdAndUpdate(userId,{ cartData: {} });

      res.json({success:true})
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({success:false})
    }
  } catch (error) {
    console.log(error);
    res.json({success:false,message: error.message})
  }
};

export {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  updateStatus,
  verifyStripePayment,
};
