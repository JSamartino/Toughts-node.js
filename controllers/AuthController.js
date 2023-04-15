const Tought = require("../models/Toughts")
const User=require("../models/User")

const bcrypt = require("bcryptjs")

module.exports=class AuthController{
    static  login(req,res){
        res.render("auth/login")

    }
    static async loginPost(req,res){
        const {email,password}=req.body
        //Se usuario existe 
        const user =await User.findOne({where: {email:email}})
        //Email errado
        if(!user){
            req.flash("message","Usario não encontrado")
            res.render("auth/register")
            return
        }
        //Se a senha está certa
        const passwordMatch=bcrypt.compareSync(password,user.password)
        if(!passwordMatch){
            req.flash("message","Senha invalida")
            res.render("auth/register")
            return


        }
        //Inicia a sessão
        req.session.userid=user.id
        req.flash("message","Autenticado com sucesso!!")
        req.session.save(()=>{
            res.redirect("/")
        })

    }
    static register (req,res){
        res.render("auth/register")
    }
    static async registerPost(req,res){
        const{name,email,password,confirmpassword}=req.body

        //validação de senha se é igual a confirmpassword
        if(password!=confirmpassword)
        {
            //mandarei mensagem no front por flash mensage
            req.flash("message","As senhas não conferem tente novamente")
            res.render("auth/register")
            return
        }

        const checkIfUserExists = await User.findOne({where: {email:email}})
        if(checkIfUserExists)
        {
            req.flash("message","O e-mail já está em uso")
            res.render("auth/register")
            return
        }

        //criar senha
        const salt =bcrypt.genSaltSync(10)
        const hashedPassword=bcrypt.hashSync(password,salt)

        const user={
            name,
            email,
            password:hashedPassword
        }
        try{
            const createdUser =await User.create(user)
            //Inicia a sessão
            req.session.userid=createdUser.id
            req.flash("message","Cadastro realizado com sucesso")
            req.session.save(()=>{
                res.redirect("/")
            })
            
        }catch(err){
            console.log(err)
        }

    }
    static logout (req,res){
        req.session.destroy()
        res.redirect("/login")
    }
    
    
}

