const sequelize = require("../config/db")
const {DataTypes} = require("sequelize")
const Contracts = require("./contracts")

const Payments = sequelize.define("payments", {
    id: {
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    method: {
        type: DataTypes.ENUM("cash","card"),
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM("pending","completed","failed"),
        allowNull: false,
        defaultValue: "pending"
    },
    paid_at:{
        type : DataTypes.DATE,
        allowNull: false
    },
    debt: {
        type: DataTypes.DECIMAL
    }
},{
    timestamps: true,
    freezeTableName: true
})


Contracts.hasMany(Payments, {as:"payments"})
Payments.belongsTo(Contracts, {as:"cotracts"})

module.exports = Payments