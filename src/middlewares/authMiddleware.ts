import { NextFunction, Request, Response } from "express"
import jwt from 'jsonwebtoken'

interface DecodedToken {
    email: string
}

const SECRET = process.env.JWT_SECRET as string

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization

    if(!authHeader){
        return res.status(401).json({ message: "Token nao informado" })
    }

    const token = authHeader.replace('Bearer', '').trim();

    try{
        const decodedToken = jwt.verify(token, SECRET) as DecodedToken
        req.body.user = { userName: decodedToken.email }
        next()
    } catch (err) {
        return res.status(401).json({ message: "Token Inválido" })
    }
}

export default authMiddleware