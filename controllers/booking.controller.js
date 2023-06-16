import mongodb from "mongodb"
import Booking from "../models/booking.model.js"
import Hotel from "../models/hotel.model.js"
import Room from "../models/room.model.js"
import Stripe from 'stripe'
import { differenceInDays } from "date-fns";


export const getuserbookings = async (req, res) => {
    try {
        const { useremail } = req.body

        const bookings = await Booking.find({ user: useremail })
        console.log(bookings, "bookings")
        if (!bookings || bookings.length === 0) {
            return res.status(404).json({ success: false, message: "You dont have any bookings yet " })
        }

        const responseData = []

        for (const booking of bookings) {
            const hotel = await Hotel.findById(booking.hotelid)
            const {
                _id,
                hotelid,
                checkInDate,
                checkOutDate,
                guests,
                additionalDetails,
                status,
                ReservationAmount,
                TotalPrice

            } = booking

            const { _id: id, name, address, price, hotelLogo } = hotel
            const roomIds = hotel.rooms
            const roomN = []

            for (const roomId of roomIds) {
                const reqRoom = await Room.findById(roomId)
                if (reqRoom) {
                    const roomNumbersForRoom = reqRoom?.roomNumbers

                    for (const item of roomNumbersForRoom) {
                        if (additionalDetails.includes(item._id.toString())) {
                            const roomData = {
                                type: reqRoom.title,
                                number: item.number,
                                roomid: roomId
                            }
                            roomN.push(roomData)

                        }
                    }
                }

            }

            const bookingData = {
                _id,
                hotelid,
                checkInDate,
                checkOutDate,
                guests,
                additionalDetails,
                status,
                ReservationAmount,
                TotalPrice,
                hotel: {
                    _id: id,
                    name,
                    address,
                    price,
                    hotelLogo,
                },
                roomN,
            }

            responseData.push(bookingData)
        }

        res.status(200).json(responseData)
    } catch (error) {
        console.log(error)
        res.status(409).json({ message: error.message })
    }
}

export const deleteBooking = async (req, res) => {
    try {


        const data = JSON.parse(req.headers['data'])
        const { id, dates } = data

        const booking = await Booking.findByIdAndDelete(id)

        if (!booking || booking == null) {
            return res.status(409).json({ message: "No booking found" })
        }
        const { additionalDetails, hotelid } = booking

        const hotel = await Hotel.findById(hotelid)
        const roomIds = hotel.rooms

        for (const roomId of roomIds) {
            const reqRoom = await Room.findById(roomId)
            const roomNumbersForRoom = reqRoom.roomNumbers
            for (const roomNumber of roomNumbersForRoom) {
                if (additionalDetails.includes(roomNumber._id.toString())) {
                    for (const date of dates) {
                        if (roomNumber.unavialableDates.includes(date)) {
                            roomNumber.unavialableDates = roomNumber.unavialableDates.filter((item) => item !== date)
                        }
                    }
                }
            }
            await reqRoom.save()
        }


        res.status(200).json({ success: true, message: "Booking deleted successfully" })
    } catch (error) {
        console.log(error)
        res.status(409).json({ message: error.message })
    }
}
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({}).sort({ createdAt: -1 })
        if (!bookings || bookings.length === 0) {
            return res.status(409).json({ message: "No bookings found" })
        }


        res.status(200).json({
            success: true,
            length: bookings.length,
            bookings
        })

    } catch (error) {
        console.log(error)
        res.status(409).json({ message: error.message })
    }
}
export const confirm_reservation = async (req, res) => {
    try {
        const { payment_intent } = req.body;
        if (!payment_intent) {
            return res.status(409).json({ message: "No payment intent found" })
        }
        const bookings = await Booking.findOneAndUpdate({ paymentIntent: payment_intent }, { $set: { status: "Approved" } }, { new: true })



        res.status(200).json({
            success: true,
            message: "Booking confirmed successfully",

        })

    } catch (error) {
        console.log(error)
        res.status(409).json({ message: error.message })
    }
}
export const updateBooking = async (req, res) => {
    const { id, status } = req.body;
    try {
        const booking = await Booking.findById(id)
        if (!booking || booking == null) {
            return res.status(409).json({ message: "No booking found" })
        }
        booking.status = status
        await booking.save()
        res.status(200).json({ success: true, message: "Booking updated successfully" })
    } catch (error) {
        console.log(error)
        res.status(409).json({ message: error.message })
    }

}
///////////////////////////
////////////////////////////////--handling the stripe paymnent here
export const create_payment_intent = async (req, res, next) => {

    const { user, hotelid, checkInDate, checkOutDate, guests, additionalDetails, paymentAmount, bookingPrice, hotelname } = req.body

    if (
        !user ||
        !hotelid ||
        !checkInDate ||
        !checkOutDate ||
        !guests ||
        !additionalDetails ||
        !paymentAmount ||
        !bookingPrice
    ) {
        return res.status(400).json({ message: "All fields are required , data is missing" })
    }

    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);               // createing the stripe instance for payment handling

        //// - calculate the required reservation amount based on the  total booking payment    
        //---date format  -->(Wed Jun 14 2023 12:37:17 GMT+0530 (India Standard Time) Thu Jun 15 2023 12:37:17 GMT+0530 (India Standard Time))<-- from client side
        const reservationAmount = parseInt(bookingPrice * (process.env.RESERVATION_AMOUNT_PERCENTAGE * 0.01)) //stripe takes lowest country denomiination  -conver it 
        const acutalAmount = reservationAmount * 100          // in rupees * paisa = Rs * 100 paisa




        // Create a PaymentIntent with the order amount and currency ------------ taken from stripe documentation
        const paymentIntent = await stripe.paymentIntents.create({
            amount: acutalAmount,
            currency: "inr",
            automatic_payment_methods: {
                enabled: true,
            },
        });

        //after creating it , need to save the details in the database of the booking  -- creating the bookinng
        const booking = new Booking({
            user: req.body.user,
            hotelid: req.body.hotelid,
            checkInDate: req.body.checkInDate,
            checkOutDate: req.body.checkOutDate,
            guests: req.body.guests,
            additionalDetails: req.body.additionalDetails,
            paymentIntent: paymentIntent.id,
            ReservationAmount: reservationAmount,
            hotelname: hotelname,
            TotalPrice: paymentAmount

        })
        const newbooking = await booking.save()

        //sending the client his client_secret to pursue payment further
        res.status(200).json({
            success: true,
            message: "client secret send after creating the booking successfully",
            clientSecret: paymentIntent.client_secret,

            newbooking: newbooking
        })

    }
    catch (error) {
        console.log(error)
        res.status(409).json({ message: error.message })
    }


}