import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {connectDb} from "./config/db.js";
import AuthRoute from "./routes/AuthRoute.js";
import ProductRoute from "./routes/ProductRoute.js";
import UserRoute from "./routes/UserRoutes.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 3000;
app.use(express.json());
app.use("/api/v1", AuthRoute)
app.use("/api/v1/products", ProductRoute)
app.use("/api/v1/users/orders", UserRoute)
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})
connectDb()
