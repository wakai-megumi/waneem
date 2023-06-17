import express from 'express'
import { verifyAdmin, verifyUser } from '../utils/VerifyToken.js'
import { createRoom, deleteRoom, getAllRoom, getRoom, updateRoom, updateroomavailability } from '../controllers/room.controller.js'
const router = express.Router()
// import { register, login, logout, currentUser } from '../controllers/auth.controller.js'



router.put('/update/:id', verifyAdmin, updateRoom)
router.delete('/delete/:id/', verifyAdmin, deleteRoom)
router.get('/get/:id', getRoom)
router.get('/all/', getAllRoom)
router.post('/updatedate/dates', verifyUser, updateroomavailability)
router.post('/createRoom', verifyAdmin, createRoom)





router.get("/", (req, res) => {
    res.send('heool')
}
)


export default router