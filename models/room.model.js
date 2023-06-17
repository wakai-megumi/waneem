
//user model
import mongoose from "mongoose"
const { Schema } = mongoose



const roomSchema = new Schema({
    title: {
        type: String,
        required: true

    },
    hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel' },

    desc: {
        type: String, required: true,
    },
    price: {
        type: Number, required: true,
    },
    maxpeople: {
        type: Number, required: true,
    },
    roomNumbers: [{
        number: Number, unavialableDates: { type: [Number], default: [] }
    }]
}, {
    timestamps: true,
})
const Room = mongoose.model("Room", roomSchema);
export default Room
