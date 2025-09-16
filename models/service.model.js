const sequelize = require("../config/db")
const {DataTypes} = require("sequelize")

const Service = sequelize.define("service",{
    id: {
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
},{
    timestamps: true,
    freezeTableName: true
})

module.exports = Service