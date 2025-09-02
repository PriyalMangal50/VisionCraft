// Add these functions to your orderController.js

// Get order statistics for admin dashboard
exports.getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: "pending" });
    
    // Aggregate to calculate total revenue
    const revenueResult = await Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: null, totalRevenue: { $sum: "$amount" } } }
    ]);
    
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;
    
    // Get status counts
    const statusCount = {
      pending: pendingOrders,
      shipped: await Order.countDocuments({ status: "shipped" }),
      delivered: await Order.countDocuments({ status: "delivered" }),
      cancelled: await Order.countDocuments({ status: "cancelled" })
    };
    
    // Recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name email")
      .select("amount status createdAt items");
    
    res.status(200).json({
      totalOrders,
      pendingOrders,
      totalRevenue,
      statusCount,
      recentOrders
    });
  } catch (error) {
    console.error("Error getting order stats:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving order statistics",
      error: error.message
    });
  }
};
