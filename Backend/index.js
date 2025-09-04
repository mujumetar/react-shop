// mongodb+srv://dilkhush:dilkhush33@dilkhush0.dmmiqfu.mongodb.net/dilkhushdb?retryWrites=true&w=majority&appName=dilkhush0


const express = require('express')
const app = express()
const port = 3000
const cors = require("cors")
const db = require("./db")
const contactModel = require("./models/contact")
const productModel = require("./models/prod")
const product = require('./models/prod')
const adminRoutes = require("./routes/admin-routes")




app.use(express.json())
app.use(cors())

app.use("/admin", adminRoutes)



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
