import Product from "../models/Product.js";
import User from "../models/User.js";

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const addProduct = async (req, res) => {
    try {
        const { name, description, price, quantity, category, media, id } = req.body;
        const user = await User.findById(id);
        if (User.hasPermission(user.role, 'ADD_PRODUCT') === false) {
            return res.status(403).json({ message: "You do not have permission to add products" });
        }
        const newProduct = new Product({ name, description, price, quantity, category, media });
        await newProduct.save();
        return res.status(201).json(newProduct);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
