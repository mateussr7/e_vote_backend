import { Router } from "express"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
const voteRouter = Router()

interface AddVoteRequestType { 
    electionId: number
    candidateId: number
    voterId: number
}

voteRouter.post("/", async (req, res) => {
    const { electionId, candidateId }: AddVoteRequestType = req.body

    const vote = await prisma.vote.create({
        data: {
            electionId,
            candidateId,
        }
    })

    if(!vote){
        res.status(500).send("Erro ao registrar um voto")
    }
    
    res.status(200).json({ vote })
})

export default voteRouter