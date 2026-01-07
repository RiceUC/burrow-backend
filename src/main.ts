import express from "express"
import cors from "cors"
import path from "path"
import { publicRouter } from "./routes/public-api"
import { privateRouter } from "./routes/private-api"
import { errorMiddleware } from "./middlewares/error-middleware"
import { PORT } from "./utils/env-util"

const app = express()

app.use(express.json())
app.use(cors())

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Burrow API is running 🐰" })
})

// Public & Private routes
app.use("/api", publicRouter)
app.use("/api", privateRouter)

// Error middleware (must be last)
app.use(errorMiddleware)

const port = PORT || 3000

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`)
})
