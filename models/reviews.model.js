import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    hotelid: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true },
    review: { type: String, required: true },
    rating: { type: Number, required: true },
    title: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    username: { type: String },
    userimage: { type: String },
});

const Reviews = mongoose.model('Review', reviewSchema);
export default Reviews;
