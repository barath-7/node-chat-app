const express = require('express')
const http = require('http')
const app = express()
const socketio = require('socket.io')
const { Server } = require("socket.io");
require('dotenv').config()
require('./dummy_test') // dummy file to test out things


const server = http.createServer(app);
const io = socketio(server)

app.use(express.static('public'))
let count=0
io.on('connection',(socket)=>{
     console.log('web socket connection')
    socket.emit('message','Welcome!')
    socket.broadcast.emit('message','New user has joined')
    socket.on('clientMessage',(clientMessage)=>{
        io.emit('message',clientMessage)
    })

    socket.on('sendLocation',(clientLocation)=>{
        io.emit('message',clientLocation)
    })
    socket.on('disconnect',()=>{
        io.emit('message','user has left')
        // socket.broadcast.emit('message','user has left')
    })
})

server.listen(process.env.PORT,()=>{
    console.log(`Server running on PORT ${process.env.PORT}`)
})