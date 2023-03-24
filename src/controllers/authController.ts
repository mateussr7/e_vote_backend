import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const SECRET = process.env.JWT_SECRET as string

const authRouter = Router()

authRouter.post("/", async (req, res) => {
    const { email, password } = req.body


    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if(!user){
        res.status(401).json({ message: "Usuário não encontrado" })
    }

    if(user?.password !== password){
        return res.status(401).json({ message: "Senha incorreta" })
    }

    const token = jwt.sign({ userName: user?.name }, SECRET, { expiresIn: '1h'})

    res.status(200).json({ user, token })
})

export default authRouter