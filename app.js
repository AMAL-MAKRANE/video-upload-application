import express from 'express'
import bp from 'body-parser'

import applyAuthMiddleware from './middlewares/auth.js'
import authRouter from './routes/auth.js'

const { urlencoded, json } = bp

const app = express()
app.use(urlencoded({ extended: true }))
app.use(json())

applyAuthMiddleware({ app })

app.use('/auth', authRouter)

app.get('/', (req, res) => {
  res.json({ status: 'OK' })
})

export default app
