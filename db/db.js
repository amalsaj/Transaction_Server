const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        mongoose.connect('mongodb+srv://arun2017ak:C5NVW6a3vqTbDcgv@cluster0.igwszen.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
        .then(()=>{
            console.log("DB connected")
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDB