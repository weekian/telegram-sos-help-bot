'use strict'
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

        // Start
        bot.start(ctx => {
            log('/start triggered')
            ctx.session.state = firstState
            ctx.reply('Hi, before we get started, let me get to know you better ☺️\n\nWhat is your name?')
            // ctx.reply(emoji.get('smiley'))
        })

        // Subsequent responses
        bot.on('text', ctx => {
            const { session } = ctx
            const message = ctx.message.text.trim()
            
            switch (session.state) {
            case states[9]:{ // Processed
                // Push to web
                break
            }
            case states[0]:{ // Pending Name 
                session.name = message
                session.state = states[1]
                ctx.reply('So your name is ' + session.name + '\n\nIs that correct?', customKeyboard(keyboardReplies, true) )
                break
            }
            case states[1]:{ // Pending Confirmation Name
                if (message === keyboardReplies[0][0]) { // Yes
                    session.state = states[2]
                    ctx.reply('Hi, ' + session.name + ', how old are you?', hideKeyboard)
                } else if (message === keyboardReplies[1][0]) { // No
                    session.state = states[0]
                    ctx.reply('Oops 😅, what is your correct name then? ', hideKeyboard)
                } else {
                    ctx.reply('I didn\' quite get that, please select either "Yes" or "No"', customKeyboard(keyboardReplies, true))
                }
                break
            }
            case states[2]:{ // Pending Age
                if (isInt(message)) {
                    let age = parseInt(message)
                    if (age < 0) {
                        ctx.reply('Huh that\'s odd, how can you have a negative age?\n\nPlease try again')
                    } else if (age > 100) {
                        ctx.reply('Huh, are you sure you are that old?🤔 \n\nPlease try again')
                    } else {
                        session.age = age
                        session.state = states[3]
                        ctx.reply('So ' + session.name + ', you are currently ' + session.age + ' years old?', customKeyboard(keyboardReplies, true))
                    }
                } else {
                    ctx.reply('I didn\'t quite get that, please enter a vaid age')
                }
                break
            }
            case states[3]:{ // Pending Confirmation Age
                if (message === keyboardReplies[0][0]) { // Yes
                    session.state = states[4]
                    ctx.reply('Cool, what is your gender?', customKeyboard(genderReplies, true))
                } else if (message === keyboardReplies[1][0]) { // No
                    session.state = states[2]
                    ctx.reply('Oops 😅, what is your correct age then? ', hideKeyboard)
                } else {
                    ctx.reply('I didn\' quite get that, please select either "Yes" or "No"', customKeyboard(keyboardReplies, true))
                }
                break
            }
            case states[4]:{ // Pending Gender
                if (message === genderReplies[0][0] || message === genderReplies[1][0] || message === genderReplies[2][0]) {
                    session.state = states[5]
                    session.gender = message
                    ctx.reply('So your gender is ' + message + ', correct?', customKeyboard(keyboardReplies, true))
                } else {
                    ctx.reply('I didn\'y quite get that, please select from one of the 3 options', customKeyboard(genderReplies, true))
                }
                break
            }
            case states[5]:{ // Pending Gender Confirmation
                if (message === keyboardReplies[0][0]) { // Yes
                    session.state = states[6]
                    ctx.reply('Thank you. what is your reason for reaching out to me?', customKeyboard(reasonReplies, true))
                } else if (message === keyboardReplies[1][0]) { // No
                    session.state = states[4]
                    ctx.reply('Oops 😅, what is your correct gender then? ', customKeyboard(genderReplies, true))
                } else {
                    ctx.reply('I didn\' quite get that, please select either "Yes" or "No"', customKeyboard(keyboardReplies, true))
                }
                break
            }
            case states[6]:{ // Pending  Reasons
                if (isValidReason(reasonReplies, message) !== undefined) {
                    session.state = states[7]
                    session.reason = message
                    ctx.reply('Thank you for sharing, so the reason is ' + ctx.reason + '\n\nCorrect?', customKeyboard(keyboardReplies, true))
                } else {
                    ctx.reply('Sorry, I didn\'t quite get that, please select from one of the options below', customKeyboard(reasonReplies, true))
                }
                break
            }
            case states[7]:{ // Pending Reasons Confirmation
                if (message === keyboardReplies[0][0]) { // Yes
                    session.state = states[8]
                    log('here')
                    ctx.reply('Are the following information correct?\n\nName: ' + session.name + '\nAge: ' + session.age + '\nGender: ' + session.gender + '\nReason: ' + session.reason , customKeyboard(keyboardReplies, true))
                } else if (message === keyboardReplies[1][0]) { // No
                    session.state = states[6]
                    ctx.reply('Sorry, what is your correct reason then? ', reasonReplies(genderReplies, true))
                } else {
                    ctx.reply('I didn\' quite get that, please select either "Yes" or "No"', customKeyboard(keyboardReplies, true))
                }
                break
            }
            case states[8]:{ // Pending Overall Confirmation
                if (message === keyboardReplies[0][0]) { // Yes
                    session.state = states[9]
                    ctx.reply('Thank you for your patience, let me check to see who is available 😊', hideKeyboard)
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