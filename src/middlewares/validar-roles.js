const { response } = require('express')
const Usuario = require('../models/user_model')

const validarROL = async (req, res=response, next) =>{

    if(!req.uid){
        return res.status(500).json({
            msg: 'Se requiere verificar el role sin validar el token primero'
        })
    }
    const usuario = await Usuario.findByPk(req.uid)
    
    if (!["Prestatario","Prestamista"].includes(usuario.tipoUsuario)){
        return res.status(401).json({
            msg:`${usuario.nomUsuario} no tiene acceso a estos apartados - No puede realiazar ninguna accion`
        })
    }

    next();
}
module.exports = {
    validarROL
}