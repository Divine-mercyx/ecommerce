import Order from "../models/Order.js";
import User from "../models/User.js";
import mongoose from "mongoose";
import Product from "../models/Product.js";

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
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const { userId, shippingAddress, phoneNumber, cartItems } = req.body;

        const user = await validateUserPermissions(userId, session);

        await processCartItems(cartItems, session);

        const order = await createAndSaveOrder({
            userId,
            shippingAddress,
            phoneNumber,
            cartItems
        }, session);

        await session.commitTransaction();
        return res.status(201).json(order);
    } catch (error) {
        await session.abortTransaction();
        return res.status(error.statusCode || 500).json({
            message: error.message
        });
    } finally {
        session.endSession();
    }
};

const validateUserPermissions = async (userId, session) => {
    const user = await User.findById(userId).session(session);
    if (!user) throw new NotFoundError('User not found');
    if (!User.hasPermission(user.role, 'order_item')) {
        throw new ForbiddenError('Insufficient order permissions');
    }
    return user;
};

const processCartItems = async (cartItems, session) => {
    if (!cartItems?.length) throw new BadRequestError('Cart is empty');

    for (const item of cartItems) {
        const product = await Product.findById(item.productId).session(session);
        if (!product) throw new NotFoundError(`Product ${item.productId} not found`);
        if (product.quantity < item.quantity) {
            throw new BadRequestError(`Insufficient stock for ${product.name}`);
        }
        product.quantity -= item.quantity;
        await product.save({ session });
    }
};

const createAndSaveOrder = async (orderData, session) => {
    const order = new Order({
        ...orderData,
        orderStatus: 'pending',
        paymentStatus: 'unpaid',
        createdAt: new Date(),
        totalAmount: await calculateTotal(orderData.cartItems)
    });
    await order.save({ session });
    return order;
};

const calculateTotal = async (cartItems) => {
    return cartItems.reduce(async (totalPromise, item) => {
        const total = await totalPromise;
        const product = await Product.findById(item.productId);
        return total + (product.price * item.quantity);
    }, Promise.resolve(0));
};

class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 404;
    }
}

class ForbiddenError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 403;
    }
}

class BadRequestError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 400;
    }
}

