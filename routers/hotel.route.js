import express from 'express'
import { addReview, countByCity, getReviews, countByType, createHotel, deleteHotel, getAllHotels, getHotel, getroominfo, singleHotel, updateHotel } from '../controllers/hotel.controller.js'
import { verifyAdmin, verifyUser } from '../utils/VerifyToken.js'
const router = express.Router()
// import { register, login, logout, currentUser } from '../controllers/auth.controller.js'


router.post('/new', verifyAdmin, createHotel)
router.patch('/updatehotel/', verifyAdmin, updateHotel)
router.delete('/delete/:id', verifyAdmin, deleteHotel)
router.get('/get/', getHotel)
router.get('/find/:id', singleHotel)
router.get('/room/:id', getroominfo)

router.get('/all/', getAllHotels)
router.get('/countbycity/', countByCity)
router.get('/countbytype/', countByType)

// review section
router.post('/reviews/', verifyUser, addReview)
router.get('/reviews/:id', getReviews)







export default router