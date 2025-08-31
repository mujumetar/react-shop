// mongodb+srv://dilkhush:dilkhush33@dilkhush0.dmmiqfu.mongodb.net/dilkhushdb?retryWrites=true&w=majority&appName=dilkhush0


const express = require('express')
const app = express()
const port = 3000
const cors = require("cors")
const db = require("./db")
const contactModel = require("./models/contact")

app.use(express.json())
app.use(cors())

app.get('/test', async (req, res) => {
  const response = await contactModel.find()
  // res.send(contact)
  return res.json({contact : response})
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
