import { Router } from 'express'

import signupController from '../controllers/auth/signup.js'
import loginController from '../controllers/auth/login.js'

const router = Router()

router.post('/signup', signupController)
router.post('/login', loginController)

export default router
