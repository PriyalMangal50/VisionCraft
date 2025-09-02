// Add these routes to your orderRoute.js
router.get("/stats", verifyTokenAndAdmin, orderController.getOrderStats);
