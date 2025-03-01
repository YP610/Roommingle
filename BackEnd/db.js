//Connects to Database to backend (express)

const mongoose= require("mongoose");

const connectDB= async () =>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
            
    } catch(error){
        console.error("It did not work because:",error)
        process.exit(1);
    }
};
module.exports=connectDB;

