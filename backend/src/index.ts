import cors from 'cors'
import dotenv from 'dotenv'
import express, { Request, Response } from 'express'
import mongoose from 'mongoose'
import path from 'path'
import { keyRouter } from './routers/keyRouter'
import { orderRouter } from './routers/orderRouter'
import { productRouter } from './routers/productRouter'
import { seedRouter } from './routers/seedRouter'
import { userRouter } from './routers/userRouter'

dotenv.config()

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost/tsmernamazonadb'
  mongoose.set('strictQuery', true)
  mongoose
    .connect(process.env.MONGODB_URI!)
    .then(() => {
      console.log('Connected to MongoDB')
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error.message)
    })
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err.message)
    })
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected')
    })

const app = express()
app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:5173', 'http://localhost:3000'],
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/products', productRouter)
app.use('/api/users', userRouter)
app.use('/api/orders', orderRouter)
app.use('/api/seed', seedRouter)
app.use('/api/keys', keyRouter)

app.use(express.static(path.join(__dirname, '../../frontend/dist')))
app.get('*', (req: Request, res: Response) =>
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'))
)

const PORT: number = parseInt((process.env.PORT || '4000') as string, 10)

app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`)
})
