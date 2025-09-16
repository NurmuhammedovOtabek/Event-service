const sequelize = require("../config/db")
const {DataTypes} = require("sequelize")

const  User = sequelize.define("user",{
    id: {
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type:DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            len: [2,50]
        }
    },
    phone:{
        type: DataTypes.STRING,
        validate: {
            isValidPhone(value) {
                if (!/^\+998(90|91|93|94|95|97|98|99|33|88|77)\d{7}$/.test(value)) {
                    throw new Error("Telefon raqami +998 bilan boshlanishi va 9 ta belgidan iborat bolishi kerak");
                }
            }
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
    password:DataTypes.STRING,
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    role: {
        type: DataTypes.ENUM("owner", "client"),
        allowNull: false
    },
    refresh_token: DataTypes.STRING
},{
    timestamps: true,
    freezeTableName: true
})

module.exports = User