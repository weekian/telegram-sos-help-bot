'use strict'
let mc = require('../modelCreator.js')
let Seq = mc.getSequelizeClass()

module.exports = {
  model: {
    volunteer_email: {type: Seq.STRING, primaryKey: true, allowNull: false},
    volunteer_firstname: {type: Seq.STRING},
    volunteer_lastname: {type: Seq.STRING},
    volunteer_password: {type: Seq.STRING}
  },
  relations: {
    oneToMany: ['chat']
  },

  options: {
    
  }

}