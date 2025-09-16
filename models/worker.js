const sequelize = require("../config/db")
const {DataTypes} = require("sequelize")

const Worker = sequelize.define("worker", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type:DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [2,50]
        }
    },
    role:{
        type: DataTypes.ENUM("DJ","Decor","Dancer","video_montaj","Videographer"),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate:{
            isEmail: true
        }
    },
    phone:{
        type: DataTypes.STRING,
        unique:true,
        validate: {
            isValidPhone(value) {
                if (!/^\+998(90|91|93|94|95|97|98|99|33|88|77)\d{7}$/.test(value)) {
                    throw new Error("Telefon raqami +998 bilan boshlanishi va 9 ta belgidan iborat bolishi kerak");
                }
            }
        }
    },
    password:{
        type: DataTypes.STRING
    },
    price: {
        type: DataTypes.DECIMAL(8,2),
        allowNull: false
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    refresh_token: DataTypes.STRING
},{
    timestamps: true,
    freezeTableName: true
})

module.exports = Worker