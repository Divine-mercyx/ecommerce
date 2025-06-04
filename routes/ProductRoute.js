import express from 'express';
import {addProduct, deleteProduct, getAllProducts, getProduct} from "../controllers/ProductController.js";
const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProduct)
router.post("/add", addProduct)
router.delete('/delete/:id', deleteProduct)

export default router;
