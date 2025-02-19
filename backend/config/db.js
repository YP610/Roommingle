//Connects to Database to backend (express)

const mongoose= require("mongoose");

const connectDB= async () =>{
    try{
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("It Worked!!!");
    } catch(error){
        console.error("It did not work because:",error)
        process.exit(1);
    }
};
module.exports=connectDB;

