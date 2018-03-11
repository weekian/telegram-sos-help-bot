'use strict'
// ---------- Constant Variables ----------

const states = [
    'pendingName',
    'pendingAge',
    'pendingGender',
    'pendingReasons',
    'pendingConfirmation',
    'processed'
]
//0 to 5

// Note: every line in the Telegram field input corresponds to an array
const keyboardReplies = [
    ['Yes'],
    ['No']
]

const genderReplies = [
    ['Male'],
    ['Female'],
    ['I\'d rather not say']
]

const reasonReplies = [
    ['Family Dispute'],
    ['Loss of Loved One(s)'],
    ['Bullying'],
    ['Abuse'],
    ['Others']
]

const customKeyboard = (inputArray, toResize) => {
    return {
        reply_markup: {
            keyboard: inputArray,
            one_time_keyboard: true,
            resize_keyboard: toResize,
            selective: false
        }
    }
}

const hideKeyboard = { reply_markup: { remove_keyboard: true } }

module.exports = {
    firstState: states[0],
    keyboardReplies,
    states,
    customKeyboard,
    hideKeyboard,
    genderReplies,
    reasonReplies
}
