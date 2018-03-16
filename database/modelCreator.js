'use strict'
let filesystem = require('fs')
let models = {}
let relationships = {}

let Sequelize = require('sequelize')
let parse = require('csv-parse')
let sequelize = null
let modelsPath = './model'


let modelCreator = {

  setup(path, database, username, password, obj) {
		modelsPath = path;
    switch (arguments.length) {
      case 3:
        sequelize = new Sequelize(database, username);
        break;
      
      case 4:
        sequelize = new Sequelize(database, username, password);
        break;

      case 5:
        sequelize = new Sequelize(database, username, password, obj);
        break;
    }

		this.init();
  },

  getSequelizeClass() {
    return Sequelize
  },

  getSequelizeInstance() {
    return sequelize
  },

  init() {
    filesystem.readdirSync(modelsPath).forEach(name => {

      let object = require(modelsPath + '/' + name)
      let options = object.options || {}
      let modelName = name.substring(0, name.length - 3)
      
      const model = sequelize.define(modelName, object.model, options)
      models[modelName] = model

      if ('relations' in object) {
        relationships[modelName] = object.relations
      }
    })

    sequelize.sync({force: process.env.REPLACE_ALL_TOKENS})
    for(let modelName in relationships) { //for each relationship recorded,
      let relationsObject = relationships[modelName]
      let model = models[modelName]

      if('oneToOne' in relationsObject) {
        relationsObject.oneToOne.forEach(relatedModelName => {
          model.hasOne(models[relatedModelName], {
            foreignKey: {allowNull: false}
          })

          models[relatedModelName].belongsTo(model, {
            foreignKey: {allowNull: false}
          })
        })
      }

      if('oneToMany' in relationsObject) {
        relationsObject.oneToMany.forEach(relatedModelName => {
          model.hasMany(models[relatedModelName], {
            foreignKey: {allowNull: false}
          })

          // models[relatedModelName].belongsToMany(model, {
          //   foreignKey: {allowNull: false}
          // })
        })
      }

      // if('ManyToMany' in relationsObject) {
      //   for (let relatedModelName in relationsObject.oneToOne) {
      //     model.belongsToMany(models[relatedModelName], {
      //       foreignKey: {allowNull: false}
      //     })

      //     models[relatedModelName].belongsToMany(model, {
      //       foreignKey: {allowNull: false}
      //     })
      //   }
      // }

    }

    // const chat = models['chat']
    // chat.create({
    //   chat_id: 2,
    //   reason: 'suicidal',
    //   requestorTelegramUsername: '@tingzhoaduu', 
    //   volunteerVolunteerEmail: 'johnlee@gmail.com'
    // })

    // volunteer.create({
    //   volunteer_email: 'jenniferchan@gmail.com',
    //   volunteer_firstname: 'jennifer',
    //   volunteer_lastname: 'chan',
    //   volunteer_password: 'adkljalsd'
    // })

    // filesystem.readdirSync(modelsPath).forEach(name => {
    //   let modelName = name.substr(0, name.length - 3)
    //   let inputFile = './model/' + modelName + '.csv'

    //   let parser = parse({
    //     delimiter: ',',
    //     function(err, data) {
          
    //     }
    //   })
    // })


  }
}

module.exports = modelCreator