'use strict'
let mc = require('../modelCreator.js')
let Seq = mc.getSequelizeClass()

module.exports = {
  model: {
    chat_id: {type: Seq.INTEGER, primaryKey: true, allowNull: false},
    reason: {type: Seq.STRING}
  },
  relations: {
    
  },

  options: {

  }
}