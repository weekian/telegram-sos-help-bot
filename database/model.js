let filesystem = require('fs')
let models = {}
let relationships = {}

let singleton = function singleton() {
  let Sequelize = require('sequelize')
  let sequelize = null
  let modelsPath = './model'
  this.setup = function (path, database, username, password, obj){
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

		init();
	}
  
  this.model = function(name) {
    return models[name]
  }

  this.Seq = function() {
    return Sequelize
  }

  function init() {
    filesystem.readdirSync(modelsPath).forEach(name => {
      let object = require(modelsPath + '/' + name)
      let options = object.options || {}
      let modelName = name.replace(/\.js$/i, "")
      models[modelName] = sequelize.define(modelName, object.model, options)
      
      if ('relations' in object) {
        relationships[modelName] = object.relations
      }
    })

    console.log(models)
    for(let name in relationships) {
      let relation = relationships[name]
      for (let relName in relation) {
        let related = relation[relName]
        console.log(related)
        // models[name][relName]
      }
    }
  }
	if (singleton.caller != singleton.getInstance){
		throw new Error("This object cannot be instantiated");
	}
}

// singleton.instance = null

// singleton.getInstance() = function() {
//   if(this.instance === null) {
//     this.instance = new singleton()
//   }
// }

module.exports = singleton