'use strict'
let mc = require('./modelCreator.js')
let Seq = mc.getSequelizeClass()


// console.log(Seq)

mc.setup('./model', 'postgres', 'postgres', 'root', {
  dialect: 'postgres',
  host: 'localhost',
  port: '5432'
})

// let qi = mc.getSequelizeInstance().getQueryInterface()
// qi.dropAllTables()