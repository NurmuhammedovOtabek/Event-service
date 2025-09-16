const express = require("express")
const config = require("config")
const sequelize = require("./config/db")
const errorHandling = require("./middlewares/errors/error.handling")
const mainApi = require("./router/index")
const cookie_parser = require("cookie-parser")

const PORT = config.get("port")

const app = express()

app.use(express.json())
app.use(cookie_parser())
app.use("/api", mainApi)
 
app.use(errorHandling)

const start = async()=>{
    try{ 
        await sequelize.authenticate()
        await sequelize.sync({ alter: true }) 
        app.listen(PORT, ()=>{
            console.log(`Server started at: ${PORT}`);
        })
    } catch(error){
        console.error(error); 
    }
}

start()