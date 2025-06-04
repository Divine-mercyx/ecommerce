import Order from "../models/Order.js";

export const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.findOne({ userId: req.params.id})
        if (!orders) {
            return res.status(404).json({ message: "No orders found for this user" });
        }
        return res.status(200).json(orders);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
