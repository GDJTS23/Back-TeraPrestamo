const {response} = require ('express');
const Usuario = require ('../models/user_model')
const bcrypt = require ('bcryptjs');
const { GenearaJWT } = require('../Helpers/GenearaJWT');

res = response;

const login = async (req,res)=>{

    const { email, contraseña, preguntaSeguridad, respuestaSeguridad } = req.body

    try {

        const usuario = await Usuario.findOne({where:{email}})
        if (!usuario){
            return res.status(400).json({
                msg:'Usuario / contraseña no son correctos (correo)',
              })
        }

        const validarContraseña = bcrypt.compareSync (contraseña ,usuario.contraseña)
        if (!validarContraseña){
            return res.status(400).json({
                msg:'Usuario / contraseña no son correctos (contraseña)',
              })
        }
        if ((usuario.preguntaSeguridad===preguntaSeguridad)== false){
            return res.status(400).json({
                msg:'La pregunta de seguridad no es correcta (Pregunta de seguridad)',
              })
        }

        const validarRespuesta = bcrypt.compareSync (respuestaSeguridad ,usuario.respuestaSeguridad)
        if (!validarRespuesta){
            return res.status(400).json({
                msg:'La respuesta de seguridad no es correcta (Respuesta de seguridad)',
              })
        }

        const token = await GenearaJWT(usuario.idUsuario);
        res.json({
           usuario,
           token
          })
        
    } catch (error) {
        return res.status(500).json({
            msg:'internal server error',
            error
          })
    }

}

module.exports = {
    login
}