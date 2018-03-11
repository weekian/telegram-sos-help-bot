'use strict'
const Telegraf = require('telegraf')
const log = require('../../utility/logger')
const RedisSession = require('telegraf-session-redis')
const routes = require('./routes')

const connectToWebServer = (app, bot) => {
    if (process.env.NODE_ENV === 'production') {
        app.use(bot.webhookCallback(process.env.TELEGRAM_ENDPOINT))
        bot.telegram.setWebhook(process.env.TELEGRAM_URL + process.env.TELEGRAM_ENDPOINT)
        log('Initialising Telegram bot via Webhook')
    } else {
        bot.startPolling()
        log('Initialising Telegram bot via Polling')
    }
}

module.exports = {
    initialize: (app) => {
        log('Initalizing Telegram bot')

        const bot = new Telegraf(process.env.TELEGRAM_API_TOKEN)

        bot.telegram.getMe().then((botInfo) => {
            bot.options.username = botInfo.username
            connectToWebServer(app,bot)
            // Connect to modules here
            routes.initialize(bot)

        })

        const session = new RedisSession({
            store: {
                url: process.env.REDIS_URL
            }
        })

        bot.use(session.middleware())

        return bot
    }
}
