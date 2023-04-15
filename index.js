const express = require ("express")
const exphbs = require("express-handlebars")
const session =require("express-session")
const FileStore=require("session-file-store")(session)
const flash = require("express-flash")

const app =express()
const conn = require("./db/conn")

//Models
const Tought =require("./models/Toughts")
const User= require("./models/User")
//Controller
const ToughtController = require("./controllers/Toughts.Controller")
//Rotas
const toughtsRoutes = require("./routes/toughtsRoutes")
const authRoutes= require("./routes/authRoutes")

//const { FORCE } = require("sequelize/types/index-hints")
//template engine
app.engine("handlebars", exphbs.engine())
app.set("view engine", "handlebars")
//receber resposta do body
app.use(
    express.urlencoded({
        extended:true
    })
)
app.use(express.json())

//session midleware diz onde o express vai salvar as sessões
//Vai guardar a sessions o caminho a guardar caminho de sessoes dados do usario que parmanece ele logado
app.use(
    session({
        name:"session",
        secret:"nosso_secret",
        resave:false,
        saveUninitialized:false,
        store: new FileStore({
            logFn:function(){},
            path:require("path").join(require("os").tmpdir(),"sessions"),
        }),
        cookie:{
            secure:false,
            maxAge:360000,
            expires: new Date(Date.now()+360000),
            httpOnly:true
        }
    })
)
//flash mensagens ao atualizar a pagina
app.use(flash())
//public path usar css
app.use(express.static("public"))
//set session to res
app.use((req,res,next)=>{
    if(req.session.userid){
        res.locals.session=req.session
        
    }
    next()
})


//salvar a sessão na resposta para poder usar flash mensagens

app.use("/toughts",toughtsRoutes)
app.use("/",authRoutes)
app.get("/",ToughtController.showThoughts)

conn
  //.sync({force:true})
  .sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));