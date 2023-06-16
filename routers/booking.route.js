import express from 'express'
import { getuserbookings, deleteBooking, getAllBookings, updateBooking, create_payment_intent, confirm_reservation } from '../controllers/booking.controller.js'
import { verifyUser } from '../utils/VerifyToken.js'

const router = express.Router()

router.get('/all-bookings', getAllBookings)
// router.get('/booking/:id', getBooking)
// router.put('/booking/:id', updateBooking)
router.delete('/delete/', deleteBooking)
router.post('/user_booking/', getuserbookings)
router.patch('/update_booking_status/', updateBooking)
router.put('/confirmReservation', confirm_reservation)


router.post('/create_payment_intent', verifyUser, create_payment_intent)                                             //


export default router







