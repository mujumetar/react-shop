const mongoose = require("mongoose")


mongoose.connect("mongodb+srv://dilkhush:dilkhush33@dilkhush0.dmmiqfu.mongodb.net/dilkhushdb?retryWrites=true&w=majority&appName=dilkhush0")

const db = mongoose.connection;

db.on("connected",(err)=>{
    if(err){
        console.log(err)
        return false
    }
    
    console.log("db id connected : ")
})


module.exports = db