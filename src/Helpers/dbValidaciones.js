const Usuario = require('../models/user_model')
const Docuemnto = require('../models/doc_model');
const Prestamo = require('../models/Prestamo_model');
const Solicitud = require('../models/solicitudes.model');

// Validar datos de Usuario
const validarIdExiste = async (idUsuario='') =>{
    const existe = await Usuario.findByPk(idUsuario);
        if (!existe) {
            throw new Error(`El Usuario con Id:${idUsuario} no se encuentra registrado`)
        }
}

const validarCorreoExiste = async ( email ='') =>{
const existe = await Usuario.findOne({
    where: {
        email
    }
});
    if (existe) {
        throw new Error(`El correo: ${email}, ya esta registrado`)
    }
}

const validarNombreUsuarioExiste = async ( nomUsuario ='') =>{
    const existe = await Usuario.findOne({
        where: {
            nomUsuario
        }
    });
        if (existe) {
            throw new Error(`El usuario: ${nomUsuario}, ya esta registrado`)
        }
}
const validarCedulaExiste = async ( cedula ='') =>{
    const existe = await Usuario.findOne({
        where: {
            cedula
        }
    });
        if (existe) {
            throw new Error(`La Cedula: ${cedula}, ya esta registrado`)
        }
}

// validar prestamo

const ValidarPrestamo = async (idPrestamo='') => {
    const existe = await Prestamo.findByPk(idPrestamo)
    if (!existe) {
        throw new Error(`El Prestamo con id = ${idPrestamo} no existe`)
    }

}
const ValidarSolicitud = async (idSolicitud='') => {
    const existe = await Solicitud.findByPk(idSolicitud)
    if (!existe) {
        throw new Error(`La solicitud con id = ${idSolicitud} no existe`)
    }

}



// Validar datos de DOCUMENTOS
const validarDOCUMENTO = async (idUsuario='') =>{
    const existe = await Usuario.findByPk(idUsuario);
        if (!existe) {
            throw new Error(`El Usuario con Id:${idUsuario} no se encuentra registrado`)
        }
        else {
            const doc = await Docuemnto.findOne({where: {idUsuario}});
            if (!doc) {
                throw new Error(`El Usuario no ha cargado ningun documento`)
            }
        }
}


module.exports = {
    validarCorreoExiste,
    validarNombreUsuarioExiste,
    validarCedulaExiste,
    validarIdExiste,
    validarDOCUMENTO,
    ValidarPrestamo,
    ValidarSolicitud
}