import Order from "../models/Order.js";
import User from "../models/User.js";

export const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.id})
        if (!orders) return res.status(404).json({ message: "No orders found for this user" });
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

export const shipOrder = async (req, res) => {
    try {
        const { userId, orderId } = req.body;
        const user = await User.findById(userId);
        if (User.hasPermission(user.role, 'SHIP_ORDER') === false) return res.status(403).json({ message: "You do not have permission to ship order" });
        const order = await Order.findById(orderId)
        order.orderStatus = 'shipped'
        return res.status(200).json(order);
    } catch(error) {
        return res.status(500).json({ message: error.message });
    }
}

export const deliverOrder = async (req, res) => {
    try {
        const { userId, orderId } = req.body;
        const user = await User.findById(userId);
        if (User.hasPermission(user.role, 'DELIVER_ORDER') === false) return res.status(403).json({ message: "You do not have permission to deliver order" });
        const order = await Order.findById(orderId)
        order.orderStatus = 'delivered'
        order.deliveredAt = new Date();
        return res.status(200).json(order);
    } catch(error) {
        return res.status(500).json({ message: error.message });
    }
}

export const orderItems = async (req, res) => {
    try {
        const { userId, shippingAddress, phoneNumber, orderStatus, totalAmount, paymentStatus, paymentMethod, paymentDate, expectedDeliveryDate, deliveredAt, cartItems } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "No user found for this user" });
        if (User.hasPermission(user.role, 'order_item') === false) return res.status(403).json({ message: "You do not have permission to order item" });
        const order = new Order({
            userId,
            shippingAddress,
            phoneNumber,
            orderStatus,
            totalAmount,
            paymentStatus,
            paymentMethod,
            paymentDate,
            expectedDeliveryDate,
            deliveredAt,
            cartItems
        })
        order.save()
        return res.status(200).json(order);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
