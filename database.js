import mongoose from "mongoose";


// initial connection
const connectDB = async () => {

    await mongoose.connect(process.env.DB_CONNECT_KEY

    )
        .then(() => console.log(`server is connected to the database`)).catch((err) => console.log(err))
}

//mongoose reconnecting checker

mongoose.connection.on('connected', () => {
    console.log('Mongoose is connected!!!!');
});
mongoose.connection.on('disconnected', () => {
    console.log("mongoose is disconnected")
})







export default connectDB