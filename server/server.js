require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cookieparser = require('cookie-parser');
const cors = require('cors');
const authRouter = require('./routes/auth/auth-routes');
const adminProductsRouter = require('./routes/admin/products-routes');
const adminOrderRouter = require('./routes/admin/order-routes');
const shopProductsRouter = require('./routes/shop/products-routes');
const shopCartRouter = require('./routes/shop/cart-routes');
const shopAddressRouter = require('./routes/shop/address-routes');
const shopOrderRouter = require('./routes/shop/order-routes');
const shopSearchRouter = require('./routes/shop/search-routes');
const shopReviewRoutes = require('./routes/shop/review-routes');

const commonFeatureRoutes = require('./routes/common/feature-routes');

mongoose.connect(process.env.MONGO_URL )
.then(()=>console.log('mongo db connected'))
.catch((error)=>console.log('error'));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
    cors({
        origin : process.env.CLIENT_BASE_URL,
        methods : ['GET', 'POST', 'DELETE', 'PUT'],
        allowedHeaders : [
            "Content-Type",
            "Authorization",
            "Cache-Control",
            "Expires",
            "Pragma"
        ],
        credentials : true
    })
);

app.use(express.json());
app.use(cookieparser());

app.use("/api/auth", authRouter);

app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);

app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRoutes);

app.use("/api/common/feature", commonFeatureRoutes);

app.listen(PORT, ()=>console.log(`server is now running on port ${PORT}`));