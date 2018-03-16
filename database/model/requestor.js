'use strict'
let mc = require('../modelCreator.js')
let Seq = mc.getSequelizeClass()

module.exports = {
  model: {
    telegram_username: {type: Seq.STRING, primaryKey: true, allowNull: false},
    requestor_name: {type: Seq.STRING},
    requestor_age: {type: Seq.INTEGER},
    requestor_gender: {type: Seq.STRING}
  },

  relations: {
    oneToMany: ['chat']
  },

  options: {
    
  }
}