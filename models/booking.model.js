
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    user: { type: String, ref: 'User', required: true },
    hotelName: { type: String },
    hotelid: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    guests: { type: Number, required: true },
    additionalDetails: {
        type: [String],
        required: true
    },
    status: { type: String, enum: ['Pending', 'Approved', 'Cancelled'], default: 'Pending' },
    paymentIntent: { type: String, required: true },
    ReservationAmount: { type: Number, required: true },
    TotalPrice: { type: Number, required: true },
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking
