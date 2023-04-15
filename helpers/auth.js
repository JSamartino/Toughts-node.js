module.exports.checkAuth = function(req,res,next){

    const userId=req.session.userid
    //Se não estiver logado
    if(!userId){
        res.redirect("/login")
    }
    next()//Se estiver autenticado ele continua

}