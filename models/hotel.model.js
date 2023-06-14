import mongoose from 'mongoose';
const { Schema } = mongoose;

const hotelSchema = new Schema({
    name: { type: String, required: [true, 'Name is required'] },
    address: { type: String, required: [true, 'Address is required'] },
    type: { type: String, required: [true, 'Type is required'] },
    adminId: { type: Schema.Types.ObjectId, ref: 'Admin' },
    city: { type: String, required: [true, 'City is required'] },
    country: { type: String, required: [true, 'Country is required'] },
    distance: { type: Number, required: [true, 'Distance is required'] },
    hotelLogo: {
        type: String,
        // default: 'https://res.cloudinary.com/dxkufsejm/image/upload/v1606329593/Hotel%20Management%20App/hotelLogo/placeholder_hotelLogo.png'


    },
    photos: { type: [String] },
    description: { type: String, required: [true, 'Description is required'] },
    title: { type: String, required: [true, 'Title is required'] },
    rating: { type: Number, min: 0, max: 5, },

    rooms: [{ type: Schema.Types.ObjectId, ref: 'Room' }],
    cheapestprice: { type: Number, required: [true, 'Cheapest price is required'] },
    featured: { type: Boolean, default: false },

});
const Hotel = mongoose.model("Hotel", hotelSchema)
export default Hotel



