import {cartItemSchema} from "./Item.js";
import mongoose from "mongoose";
import {shippingAddressSchema} from "./ShippingAddress.js";


const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    shippingAddress: {
        type: shippingAddressSchema,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    orderStatus: {
        type: String,
        required: true,
        enum: ['pending', 'shipped', 'delivered', 'canceled'],
        default: 'pending'
    },
    totalAmount: {
        type: Number,
        required: true
    },

    paymentStatus: {
        type: String,
        required: true,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: ['credit_card', 'paypal', 'cash_on_delivery', 'bank_transfer'],
        required: true
    },
    paymentDate: {
        type: Date,
        required: function() { return this.paymentStatus === 'paid'; }
    },
    paymentIntentId: String,
    expectedDeliveryDate: Date,
    deliveredAt: Date,
    cartItems: {
        type: [cartItemSchema],
        required: true
    }
}, {timestamps: true});


export default mongoose.model('Order', orderSchema);
