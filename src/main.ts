import express from "express"
import { UserController } from "./controllers/user-controller"
import { authMiddleware } from "./middlewares/auth-middleware"
import { errorMiddleware } from "./middlewares/error-middleware"
import { PORT } from "./utils/env-util"

const app = express()

app.use(express.json())

// Health check
app.get("/", (req, res) => {
    res.json({ message: "Burrow API is running 🐰" })
})

// Public routes
app.post("/api/auth/register", UserController.register)
app.post("/api/auth/login", UserController.login)

// Protected routes
app.get("/api/users/profile", authMiddleware, UserController.getProfile)
app.put("/api/users/profile", authMiddleware, UserController.updateProfile)
app.delete("/api/users/account", authMiddleware, UserController.deleteAccount)

// Error middleware (must be last)
app.use(errorMiddleware)

const port = PORT || 3000

app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`)
})
