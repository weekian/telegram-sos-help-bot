'use strict'
const moment = require('moment-timezone')
const events = require('events')
const log = require('../../../utility/logger')
const {
    states,
    firstState,
    keyboardReplies,
    customKeyboard,
    hideKeyboard,
    genderReplies,
    reasonReplies
} = require('../controllers')
const { broadcastNewChat, broadcastMsg } = require('../../../web/routes/socket')
const emitter = require('../../../utility/emitter').getEmitter()
function isInt(value) {
    return !isNaN(value) && 
           parseInt(Number(value)) == value && 
           !isNaN(parseInt(value, 10))
}

function isValidReason(reasonReplies, message) {
    return reasonReplies.find(function(e) {
        return e[0] === message
    })
}


module.exports = {
    initialize: (bot) => {
        log('setting up emitter')
        emitter.on('sendMsg', data => {
            log('event triggered')
            bot.telegram.sendMessage(data.id, data.msg)
        })
        log('emitter set up')

        // Getting Name
        bot.start(ctx => {
            log('/start triggered')
            ctx.session.state = firstState
            ctx.session.id = ctx.from.id
            log(ctx.session.id)
            ctx.reply('Hi, before we get started, let me get to know you better ☺️\n\nWhat is your name?')
        })

        bot.on('text', ctx => {
            const { session } = ctx
            const message = ctx.message.text.trim()
            
            switch (session.state) {
            case states[5]:{
                broadcastMsg(session.name, message, moment().tz('Asia/Singapore').format('D/MM/YYYY hh:mm A'), session.id)
                break
            }
            // Getting Age
            case states[0]:{
                log(states[0] + ' triggered')
                session.name = message
                session.state = states[1]
                ctx.reply('Hi ' + session.name + ', how old are you?', hideKeyboard)
                break
            }
            // Getting Gender
            case states[1]:{
                log(states[1] + ' triggered')
                if (isInt(message)) {
                    let age = parseInt(message)
                    if (age < 0) {
                        ctx.reply('Huh that\'s odd, how can you have a negative age?\n\nPlease try again')
                    } else if (age > 100) {
                        ctx.reply('Huh, are you sure you are that old?🤔 \n\nPlease try again')
                    } else {
                        session.age = age
                        session.state = states[2]
                        ctx.reply('Cool, what is your gender?', customKeyboard(genderReplies, true))
                    }
                } else {
                    ctx.reply('I didn\'t quite get that, please enter a vaid age')
                }
                break
            }
            // Getting reason
            case states[2]:{ // Pending Gender
                log(states[2] + ' triggered')
                if (message === genderReplies[0][0] || message === genderReplies[1][0] || message === genderReplies[2][0]) {
                    session.state = states[3]
                    session.gender = message
                    ctx.reply('Thank you. what is your reason for reaching out to me?', customKeyboard(reasonReplies, true))
                } else {
                    ctx.reply('I didn\'t quite get that, please select from one of the 3 options', customKeyboard(genderReplies, true))
                }
                break
            }
            // Confirmation of information provided
            case states[3]:{
                log(states[3] + ' triggered')
                if (isValidReason(reasonReplies, message) !== undefined) {
                    session.state = states[4]
                    session.reason = message
                    ctx.reply('Is the following information correct?\n\nName: ' + session.name + '\nAge: ' + session.age + '\nGender: ' + session.gender + '\nReason: ' + session.reason , customKeyboard(keyboardReplies, true))
                } else {
                    ctx.reply('I didn\'t quite get that, please select from the options provided', customKeyboard(reasonReplies, true))
                }
                break
            }
            // Handing over to express app
            case states[4]:{
                log(states[4] + ' triggered')
                if (message === keyboardReplies[0][0]) { // Yes
                    session.state = states[5]
                    ctx.reply('Thank you for your patience, let me check to see who is available 😊', hideKeyboard)
                    log('Throwing to socket')
                    broadcastNewChat(session.name, session.age, session.gender, session.reason, moment().tz('Asia/Singapore').format('D/MM/YYYY hh:mm A'), session.id)
                } else if (message === keyboardReplies[1][0]) { // No
                    session.state = states[0]
                    ctx.reply('Oops, let\'s try again, what is your name?', hideKeyboard)
                } else {
                    ctx.reply('I didn\' quite get that, please select either "Yes" or "No"', customKeyboard(keyboardReplies, true))
                }
                break
            }
            }
        })
    }
}