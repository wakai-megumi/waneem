import express from 'express'
import { login, logout, register } from '../controllers/auth.controller.js'
const router = express.Router()
// import { register, login, logout, currentUser } from '../controllers/auth.controller.js'


router.post('/register', register)
router.post('/login', login)
router.get('/logout', logout)


export default router