'use strict'
const log = require('../../../utility/logger')
const { send } = require('../../../bot/telegram/routes/index')
const emitter = require('../../../utility/emitter').getEmitter()


const whiteListedChatIds = [
    46233065,
    175960319,
    77114691,
    417714180
]

module.exports = {
    initialize: (io) => {
        this.io = io
        log('Initializing Socket connection')
        io.on('connection', (socket) => {
            log('Connection established')
            this.socket = socket
            
            registerRoutes(socket, io)
        })
    },
    broadcastNewChat: (name, age, gender, reason, timeNow, id) => {
        if (whiteListedChatIds.indexOf(id) !== -1) {
            this.io.emit('newChat', {
                name,
                age,
                gender,
                reason,
                timeNow,
                id
            })
        }
    },
    broadcastMsg: (name, msg, timeNow, id) => {
        if (whiteListedChatIds.indexOf(id) !== -1) {
            this.io.emit('newMsg', {
                name,
                msg,
                timeNow,
                id
            })
        }
    }
}

const registerRoutes = (socket, io) => {
    socket.on('disconnect', function(){
        log('connection lost')
    })
    socket.on('sendMsg', function(data){
        console.log('inside sendMsg, emitting message')
        // send(data.id, data.msg)
        emitter.emit('sendMsg', {
            id: data.id,
            msg: data.msg
        })
    })
}