const { response } = require('express')
const Usuario = require ('../models/user_model')
const jwt = require('jsonwebtoken')

const validarJWT = async (req, res=response, next) =>{
     
    const token = req.header('key');
     if(!token){
        return res.status(401).json({
            msg:'Noy hay un token en la peticion'
        })
     }
     try {

        const {uid} =jwt.verify( token, process.env.SECRETORPRIVATEKEY );

        const usuario = await Usuario.findByPk(uid)

        if(!usuario){
            return res.status(401).json({
                msg:'Token no valido - El Usuario no existente'
            })
        }

        req.uid=uid;     

     } catch (error) {
        return res.status(401).json({
            msg:'Token no valido',
            error
        })
     }
     next();
}
module.exports = {
    validarJWT
}