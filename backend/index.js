const express = require('express')
require('dotenv').config()
const app = express();
const cors = require('cors')
app.use(express.json())
const mongoose = require('mongoose')
mongoose.connect(process.env.DB_URL)
const mainRouter = require('./routes/index')
app.use('/api/v1', mainRouter)

app.listen(process.env.PORT)
