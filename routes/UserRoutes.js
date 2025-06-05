import express from "express";
import {cancelOrder, deliverOrder, getUserOrders, orderItems, shipOrder} from "../controllers/UserController.js";
const router = express.Router();

router.get('/:id', getUserOrders)
router.put("/order/cancel", cancelOrder)
router.put("/order/ship", shipOrder)
router.put('/order/deliver', deliverOrder)
router.post('/checkout', orderItems)
export default router;
