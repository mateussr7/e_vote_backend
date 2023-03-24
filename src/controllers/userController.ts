import { Router, Request, Response, json } from 'express'
import { PrismaClient } from '@prisma/client'
import authMiddleware from '../middlewares/authMiddleware'

const prisma = new PrismaClient()

const userRouter = Router()

userRouter.post("/create", async (req, res) => {
    const { name, email, password } = req.body

    const user = await prisma.user.create({
        data: {
            name, email, password
        }
    })

    if(!user){
        res.status(400).json({ message: "Usuário inválido "})
    }

    res.status(200).json({ user })
})

userRouter.post("/op", async (req, res) => {
    const { id } = req.body

    const user = await prisma.user.update({
        where: { id },
        data: { isAdmin: true }
    })

    res.status(200).json({ user })
})

userRouter.get("/candidates", async (req, res) => {
    const candidates = await prisma.user.findMany({
        where: {
            isAdmin: false
        }
    })

    res.status(200).json({ candidates })
})

userRouter.get("/",  async (req, res) => {
    const users = await prisma.user.findMany()

    res.status(200).json({ users })
})

export default userRouter
