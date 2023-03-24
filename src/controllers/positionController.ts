import { Router } from "express"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
const positionRouter = Router()

positionRouter.post("/", async (req, res) => {
    const { name } = req.body

    const position = await prisma.position.create({
        data: {
            name
        }
    })

    if(!position){
        res.status(401).send("Erro ao criar um novo Cargo")
    }

    res.status(200).json({ position })
})

positionRouter.post("/delete", async (req, res) => {
    const { id } = req.body

    const deletedPosition = await prisma.position.delete({
        where: { id }
    });

    res.status(200).json({ deletedPosition })
})

positionRouter.get("/", async (req, res) => {
    const positions = await prisma.position.findMany()

    if(!positions){
        res.status(500).send("Erro ao buscar os Cargos")
    }

    res.status(200).json({ positions })
})

export default positionRouter