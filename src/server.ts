import express from 'express'
import cors from 'cors'
import userRouter from './controllers/userController'
import authRouter from './controllers/authController'
import positionRouter from './controllers/positionController'
import electionRouter from './controllers/electionController'
import voteRouter from './controllers/voteController'

const app = express()

app.use(cors())
app.use(express.json())

app.use("/user", userRouter)
app.use("/auth", authRouter)
app.use("/position", positionRouter)
app.use("/election", electionRouter)
app.use("/vote", voteRouter)


app.listen(8080, () => {
    console.log("[SERVER] Servidor rodando na porta 8080")
})