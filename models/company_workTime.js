const sequelize = require("../config/db")
const {DataTypes} = require("sequelize")
const Company = require("./company")

const Company_workTime = sequelize.define("companyWorkTime",{
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

Company.hasMany(Company_workTime,{as:"companyWorkTime"})
Company_workTime.belongsTo(Company, {as: "company"})



module.exports = Company_workTime