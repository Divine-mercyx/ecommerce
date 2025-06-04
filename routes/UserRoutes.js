import express from "express";
import {getUserOrders} from "../controllers/UserController.js";
const router = express.Router();

router.get('/:id', getUserOrders)

export default router;
