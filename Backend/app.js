// app.js
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dfWebhook from "./dialogflow/webhook.js";
import userRoutes from './routes/user.route.js'
import universityRoutes from './routes/university.route.js'
import scholarshipRoutes from './routes/scholarship.route.js'
import applicationRoutes from './routes/application.route.js'
import adminRoutes from "./routes/admin.route.js"
const app = express()

const ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173'

          

app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin:"http://localhost:5173",
    credentials: true,
    methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization']
  })
)


app.get('/', (_req, res) => res.send('Backend is running!'))

app.use('/api/auth', userRoutes)          
app.use('/api/universities', universityRoutes)
app.use('/api/scholarships', scholarshipRoutes)
app.use('/api/applications', applicationRoutes)
app.use('/api/admin', adminRoutes);  
app.use("/webhook", dfWebhook);
export default app
