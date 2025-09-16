const sequelize = require("../config/db")
const {DataTypes} = require("sequelize")
const Service = require("./service.model")
const Company = require("./company")

const Company_service = sequelize.define("company_service",{
    id: {
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    }
},{
    timestamps: true,
    freezeTableName: true
})

Company.belongsToMany(Service, {through: Company_service})
Service.belongsToMany(Company, {through: Company_service})

Company.hasMany(Company_service, {as: "company_service"})
Company_service.belongsTo(Company,{as:"copmany"})

Service.hasMany(Company_service, {as: "company_service"})
Company_service.belongsTo(Service, {as:"service"})

module.exports = Company_service