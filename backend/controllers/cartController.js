import userModel from "../models/userModel.js";

const addToCart = async (req, res, next) => {
    try {
        const { userId, itemId, size, prescription } = req.body;

        let userData = await userModel.findById(userId);
        let cartData = await userData.cartData;

        // Create a unique key for the item+size+prescription combination
        const prescriptionKey = prescription ? JSON.stringify(prescription) : 'none';
        const itemKey = `${size}|${prescriptionKey}`;

        if (cartData[itemId]) {
            if (cartData[itemId][itemKey]) {
                cartData[itemId][itemKey].quantity += 1;
            } else {
                cartData[itemId][itemKey] = {
                    quantity: 1,
                    size: size,
                    prescription: prescription
                };
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][itemKey] = {
                quantity: 1,
                size: size,
                prescription: prescription
            };
        }

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Added to cart" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const updateCart = async (req, res, next) => {
    try {
        const { userId, itemId, size, quantity, prescription } = req.body;

        const userData = await userModel.findById(userId);
        let cartData = await userData.cartData;

        // Create a unique key for the item+size+prescription combination
        const prescriptionKey = prescription ? JSON.stringify(prescription) : 'none';
        const itemKey = `${size}|${prescriptionKey}`;

        if (!cartData[itemId] || !cartData[itemId][itemKey]) {
            return res.json({ success: false, message: "Item not found in cart" });
        }

        cartData[itemId][itemKey].quantity = quantity;

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Cart Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const getUserCart = async (req, res, next) => {
    try {
        const { userId } = req.body;
        const userData = await userModel.findById(userId);

        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({ success: true, cartData: userData.cartData || {} });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { addToCart, updateCart, getUserCart };
