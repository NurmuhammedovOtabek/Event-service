const sequelize = require("../config/db")
const {DataTypes} = require("sequelize")
const Worker = require("./worker")

const Worker_workTime = sequelize.define("workerWorkTome",{
    id: {
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    start_time: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end_time: {
        type: DataTypes.DATE,
        allowNull: false
    }
},{
    timestamps: true,
    freezeTableName: true
})

Worker.hasMany(Worker_workTime,{as:"workerWorkTome"})
Worker_workTime.belongsTo(Worker, {as: "worker"})

module.exports = Worker_workTime