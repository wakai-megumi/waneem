import express from 'express'
import { verifyAdmin } from '../utils/VerifyToken.js'
import { createRoom, deleteRoom, getAllRoom, getRoom, updateRoom, updateroomavailability } from '../controllers/room.controller.js'
const router = express.Router()
// import { register, login, logout, currentUser } from '../controllers/auth.controller.js'



router.post('/:hotelid', verifyAdmin, createRoom)
router.put('/update/:id', verifyAdmin, updateRoom)
router.delete('/delete/:id/', verifyAdmin, deleteRoom)
router.get('/get/:id', getRoom)
router.get('/all/', getAllRoom)
router.post('/updatedate/dates', updateroomavailability)





router.get("/", (req, res) => {
    res.send('heool')
}
)


export default router