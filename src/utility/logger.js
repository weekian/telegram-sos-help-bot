'use strict'

const logger = require('winston')

module.exports = (text, keys) => {
    logger.info(text)
    keys.forEach(e => {
        try {
            logger.info(`Keys: ${JSON.stringify(e, null, 4)}`)
        } catch (err) {
            logger.info('Note: Given text cannot be converted to JSON String')
            logger.info(`Raw Text: ${e}`)
        }
    })
}
