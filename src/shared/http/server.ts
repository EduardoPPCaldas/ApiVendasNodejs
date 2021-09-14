import 'reflect-metadata'
import express, { NextFunction, Request, Response } from "express"
import cors from 'cors'
import router from "./routes"
import AppError from "@shared/errors/AppError"
import '@shared/typeorm'

const app = express()

app.use(cors())

app.use(express.json())

app.use(router)

app.use((error: Error, req: Request, res: Response, next: NextFunction)=>{
  if(error instanceof AppError){
    return res.status(error.statusCode).json({
      status: "Error",
      message: error.message
    })
  }

  return res.status(500).json({
    status: "Error",
    message: "Internal server error"
  })
})

app.listen(8000)