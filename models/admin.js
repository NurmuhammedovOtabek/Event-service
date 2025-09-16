const sequelize = require("../config/db")
const {DataTypes} = require("sequelize")

const Admin = sequelize.define("admin",{
    id : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type:DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            len: [2,50]
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate:{
            isEmail: true
        }
    },
    password: DataTypes.STRING,
    is_creator: DataTypes.BOOLEAN,
    is_active : DataTypes.BOOLEAN,
    refresh_token: DataTypes.STRING
},{
    timestamps: true,
    freezeTableName: true
})

module.exports = Admin