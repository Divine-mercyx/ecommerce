import express from "express";
import {cancelOrder, getUserOrders} from "../controllers/UserController.js";
const router = express.Router();

router.get('/:id', getUserOrders)
router.put("/order/cancel", cancelOrder)

export default router;
