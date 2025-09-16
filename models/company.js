const sequelize = require("../config/db")
const {DataTypes} = require("sequelize");
const User = require("./user");

const Company = sequelize.define("company",{
    id: {
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    company_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    phone:{
        type: DataTypes.STRING,
        unique: true,
        validate: {
            isValidPhone(value) {
                if (!/^\+998(90|91|93|94|95|97|98|99|33|88|77)\d{7}$/.test(value)) {
                    throw new Error("Telefon raqami +998 bilan boshlanishi va 9 ta belgidan iborat bolishi kerak");
                }
            }
        }
    },
    price:{
        type: DataTypes.DECIMAL(8,2),
        allowNull: false
    }
},{
    timestamps: true,
    freezeTableName: true
})

User.hasMany(Company,{as: "company"})
Company.belongsTo(User, {as:"user"})

module.exports = Company