import express from 'express'
import { deleteUser, getAllUsers, getUser, updateUser } from '../controllers/user.controller.js'
import { VerifyToken, verifyAdmin, verifyUser } from '../utils/VerifyToken.js'
const router = express.Router()
// import { register, login, logout, currentUser } from '../controllers/auth.controller.js'


router.put('/update/:id', verifyUser, updateUser)
router.delete('/delete/:id', verifyUser, deleteUser)
router.get('/get/:id', verifyUser, getUser)
router.get('/all/', verifyAdmin, getAllUsers)



router.get("/", (req, res) => {
    console.log('jdjdjd')
    res.send('heool')
}
)


export default router