const sequelize = require("../config/db")
const {DataTypes} = require("sequelize")
const Worker = require("./worker")
const Company = require("./company")
const User = require("./user")

const Contracts = sequelize.define("contracts", {
    id: {
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    duration_minut: {
        type: DataTypes.ENUM("1", "30", "60", "120", "180"),
        allowNull: false
    },
    start_time: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end_time: {
        type: DataTypes.DATE,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(8,2),
        allowNull: false
    },
    location: {
        type: DataTypes.STRING,
        allowNull:false
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
},{
    timestamps: true,
    freezeTableName: true
})

Worker.hasMany(Contracts, {as: "contracts"})
Contracts.belongsTo(Worker, {as:"worker"})

Company.hasMany(Contracts, {as:"contracts"})
Contracts.belongsTo(Company, {as:"copmany"})

User.hasMany(Contracts, {as: "contract"})
Contracts.belongsTo(User,{as: "user"})

module.exports = Contracts