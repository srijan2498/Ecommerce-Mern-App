const express = require("express");
const morgan = require("morgan");
const colors = require("colors");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDb = require("./config/db");
const path = require('path')

const app = express();

//config
dotenv.config();

//connect to database
connectDb();

//middlewares
app.use(cors())
app.use(express.json());
app.use(morgan('dev'));

const port = process.env.PORT || 8080;


app.use(express.static(path.join(__dirname, './client/build')))

//routes
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/category', require('./routes/categoryRoutes'));
app.use('/api/v1/tag', require('./routes/tagRoutes'))
app.use('/api/v1/product', require('./routes/productRoutes'));
app.use('/api/v1/address', require('./routes/addressRoutes'));

// static files
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, './client/build/index.html'))
})

app.listen(port, () => {

})
