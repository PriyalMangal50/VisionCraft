// Add these functions to your productController.js

// Get product statistics for admin dashboard
exports.getProductStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    
    // Get category counts
    const categoryCount = {
      eyeglasses: await Product.countDocuments({ category: "eyeglasses" }),
      sunglasses: await Product.countDocuments({ category: "sunglasses" }),
      contacts: await Product.countDocuments({ category: "contacts" })
    };
    
    // Get count by prescription type
    const prescriptionTypeCount = {
      required: await Product.countDocuments({ prescriptionRequired: true }),
      optional: await Product.countDocuments({ prescriptionRequired: false }),
      none: await Product.countDocuments({ prescriptionType: "none" })
    };
    
    // Recent products
    const recentProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title price category prescriptionType images');
    
    res.status(200).json({
      totalProducts,
      categoryCount,
      prescriptionTypeCount,
      recentProducts
    });
  } catch (error) {
    console.error("Error getting product stats:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving product statistics",
      error: error.message
    });
  }
};
