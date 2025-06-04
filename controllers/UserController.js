import Order from "../models/Order.js";
import User from "../models/User.js";

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

export const cancelOrder = async (req, res) => {
    try {
        const { userId, orderId } = req.body;
        const user = await User.findById(userId);
        if (User.hasPermission(user.role, 'CANCEL_ORDER') === false) return res.status(403).json({ message: "You do not have permission to cancel order" });
        const order = await Order.findById(orderId)
        order.orderStatus = 'cancelled'
        return res.status(200).json(order);
    } catch(error) {
        return res.status(500).json({ message: error.message });
    }
}
