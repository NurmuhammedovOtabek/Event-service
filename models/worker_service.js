const sequelize = require("../config/db")
const {DataTypes} = require("sequelize")
const Worker = require("./worker")
const Service = require("./service.model")

const Worker_service = sequelize.define("worker_service",{
    id: {
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    }
},{
    timestamps: true,
    freezeTableName: true
})

Worker.belongsToMany(Service, {through: Worker_service})
Service.belongsToMany(Worker, {through: Worker_service})

Worker.hasMany(Worker_service, {as: "worker_service"})
Worker_service.belongsTo(Worker,{as:"worker"})

Service.hasMany(Worker_service, {as: "worker_service"})
Worker_service.belongsTo(Service, {as:"service"})

module.exports = Worker_service