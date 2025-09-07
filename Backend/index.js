
import dotenv from 'dotenv'
import connectDB from './db.js'
import app from './app.js'

dotenv.config()

const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI; 
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error('DB connection failed:', err?.message || err)
    process.exit(1)
  })
