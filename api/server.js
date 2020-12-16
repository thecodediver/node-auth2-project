const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const AuthRouter = require("./auth/auth-router")
const UserRouter = require("./users/users-router")

const server = express()

server.use(cors())
server.use(express.json())
server.use(helmet())

server.use("/api/auth", AuthRouter)
server.use("/api/users", UserRouter)

server.get("/", (req, res) => {
  res.status(200).json("You made it")
})

module.exports = server