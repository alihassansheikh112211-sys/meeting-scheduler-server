require('dotenv').config()
const express = require('express')
const app = express()
const connectDB = require('./connect')
const meetingRouter = require('./routes/meeting')
const userRouter = require('./routes/user')
const reportRouter = require('./routes/report')
const cors = require('cors')

const port = process.env.PORT
connectDB()
app.use(cors({ origin: "https://meeting-scheduler-system-cleint-p6dxksasa.vercel.app" }))
app.use(express.json())
app.use('/', meetingRouter)
app.use('/', userRouter)
app.use('/', reportRouter)

app.listen(port, () => {
    console.log(`Application is up and running on port ${port}`)
})
