import { Router } from "express"
import { PrismaClient } from "@prisma/client"

interface CreateRequestTypes {
    name: string
    positionId: number,
    candidatesIds: number[]
}

interface AddCandidatesRequestTypes {
    id: number
    candidatesIds: number[]
}

interface RemoveCandidatesRequestTypes {
    id: number
    candidatesIds: number[]
}

interface VoteCount {
    [id: number]: number
}

interface Result {
    [key: string]: any
}

const prisma = new PrismaClient()

const electionRouter = Router()

electionRouter.post("/", async (req, res) => {
    const { name, positionId, candidatesIds }: CreateRequestTypes = req.body

    const election = await prisma.election.create({
        data: {
            name, 
            position: {
                connect: { id: positionId }
            },
            candidates: {
                connect: candidatesIds.map(id => ({ id }))
            }
        }
    })

    if(!election){
        res.status(500).send("Erro ao criar uma nova Eleição")
    }

    res.status(200).json({ election })
})

electionRouter.post("/add-candidates", async (req, res) => {
    const { id, candidatesIds }: AddCandidatesRequestTypes = req.body

    const updatedElection = await prisma.election.update({
        where: { id },
        data: {
            candidates: {
                connect: candidatesIds.map(id => ({ id }))
            }
        },
        include: {
            candidates: true,
            position: true,
        }
    })

    if(!updatedElection){
        res.status(500).send("Houve um problema ao adicionar novos candidatos")
    }

    res.status(200).json({ updatedElection })
})

electionRouter.post("/remove-candidates", async (req, res) => {
    const { id, candidatesIds }: RemoveCandidatesRequestTypes = req.body

    const updatedElection = await prisma.election.update({
        where: { id },
        data: {
            candidates: {
                disconnect: candidatesIds.map(id => ({ id }))
            }
        },
        include: {
            candidates: true,
            position: true,
        }
    })

    if(!updatedElection){
        res.status(500).send("Houve um problema ao remover estes candidatos")
    }

    res.status(200).json({ updatedElection })
})

electionRouter.post("/start-election", async (req, res) => {
    const { id } = req.body

    const election = await prisma.election.update({
        where: { id },
        data: { startDate: new Date() }
    })

    if(!election){
        res.status(404).send("Não encontramos essa eleição")
    }

    res.status(200).json({ election })
})

electionRouter.post("/finish-election", async (req, res) => {
    const { id } = req.body

    const election = await prisma.election.update({
        where: { id },
        data: { endDate: new Date() }
    })

    if(!election){
        res.status(404).send("Não encontramos essa eleição")
    }

    res.status(200).json({ election })
})


interface ReqBody {
    id: number
}

electionRouter.post("/results", async (req, res) => {
    const { id }: ReqBody = req.body

    const election = await prisma.election.findUnique({ 
        where: { id }, 
        include: { candidates: true } 
    })

    if(!election){
        res.status(404).send("Não encontramos essa eleição")
    }

    if(election?.endDate === null){
        res.status(404).send("Essa eleição ainda não foi encerrada")
    }

    const votes = await prisma.vote.findMany({ where: { electionId: id } })

    if(votes.length === 0){
        res.status(200).send("Não houveram votos para essa eleição")
    }

    const candidates = election?.candidates

    const voteCount: VoteCount = {}

    Array.isArray(candidates) && candidates.forEach(candidate => {
        voteCount[candidate.id] = 0
    })

    votes.forEach(vote => {
        voteCount[vote.candidateId]++
    })


    const counter = Object.entries(voteCount)
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .reduce((acc, [id, count]) => ({ ...acc, [id]: count }), {});

    const results: Result = {}

    for(const [key, value] of Object.entries(counter)){
        const user = candidates?.find(u => u.id === Number(key))
        results[user?.name as string] = value
    }


    res.status(200).json({ results })

})

electionRouter.get("/", async (req, res) => {
    const elections = await prisma.election.findMany({
        include: {
            candidates: true,
            position: true,
        }
    })

    if(!elections){
        res.status(500).send("Não foi possível buscar as eleições")
    }

    res.status(200).json({ elections })
})

export default electionRouter