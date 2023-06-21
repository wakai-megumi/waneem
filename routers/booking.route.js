import express from 'express'
import { getuserbookings, deleteBooking, getAllBookings, updateBooking, create_payment_intent, confirm_reservation } from '../controllers/booking.controller.js'
import { verifyAdmin, verifyUser } from '../utils/VerifyToken.js'

const router = express.Router()

router.get('/all-bookings', getAllBookings)
// router.get('/booking/:id', getBooking)
// router.put('/booking/:id', updateBooking)
router.delete('/delete/:id', verifyUser, deleteBooking)
router.post('/user_booking/all/:id', verifyUser, getuserbookings)
router.patch('/update_booking_status', verifyUser, updateBooking)
router.put('/confirmReservation/:id', verifyUser, confirm_reservation)


router.post('/create_payment_intent/:id', verifyUser, create_payment_intent)                                             //


export default router







