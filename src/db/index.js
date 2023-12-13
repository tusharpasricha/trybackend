const mongoose = require('mongoose');
const DB_NAME= require('../constants.js');
require('dotenv').config({
    path : '../../.env'
});
const connectDB = async ()=>{
    console.log(process.env.MONGO);
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGO}`,{
               useNewUrlParser: true,
              useUnifiedTopology: true,
              })
        console.log(`Mongo Connected DB host: ${connectionInstance.connection.host}`)
    }catch(error){
        console.log("mongo error",error);
    }
}

module.exports = connectDB