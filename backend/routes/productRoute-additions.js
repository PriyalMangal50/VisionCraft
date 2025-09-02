// Add these routes to your productRoute.js
router.get("/stats", verifyTokenAndAdmin, productController.getProductStats);
