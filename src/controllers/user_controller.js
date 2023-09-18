
const bcrypt = require ('bcryptjs');
const uuid = require('uuid')

const Usuario = require ('../models/user_model');
const Prestatrio = require ('../models/prestatario_model');
const Prestamista = require('../models/prestamista_model');

const { GenearaJWT } = require('../Helpers/GenearaJWT');
const {response} = require ('express');

res = response;

  const obtenerUsuarios = (req, res ) => {
  res.json({
      msg:'get API - control'
  })
  }

const obtenerUsuario = async (req, res ) => {
    
  const {idUsuario} = req.params;

  try {
      const usuario = await Usuario.findByPk(idUsuario);
      res.json({
        msg:'Usuario encontrado correctamente',
        usuario
    })
    } catch (error) {
      res.status(500).json({
        msg:'internal server error',
        error
      })
    }
  }

  const actualizarUsuario = async (req, res ) => {

    const {idUsuario}= req.params;
    const {...resto}=req.body;

    try {
      const usuario = await Usuario.update( resto, {where:{idUsuario}});
      res.json({
        msg:'Usuario Modificado correctamente',
        usuario
    })
    } catch (error) {
      res.status(500).json({
        msg:'internal server error',
        error
      })
    }

  }

  function tieneDiferenciaDe18Anios(date) {
    const fechaActual = new Date();
    const diferenciaEnMilisegundos = fechaActual - date;
    const milisegundosEnUnAnio = 1000 * 60 * 60 * 24 * 365.25;
    const diferenciaEnAnios = diferenciaEnMilisegundos / milisegundosEnUnAnio;
    return diferenciaEnAnios >= 18;
  }
  

  const crearUsuario = async (req, res ) => {

    const {
      nombre,
      apellido,
      cedula,
      email,
      telefono,
      nomUsuario,
      contraseña,
      preguntaSeguridad,
      respuestaSeguridad,
      tipoUsuario,
      fechaNac
    } = req.body;

    const usuario = new Usuario( {
      idUsuario: uuid.v4(),
      nombre,
      apellido,
      cedula,
      email,
      telefono,
      nomUsuario,
      contraseña,
      preguntaSeguridad,
      respuestaSeguridad,
      tipoUsuario,
      fechaNac
    } );

    const prestatario = new Prestatrio({
      idPrestatario:uuid.v4(),
      idUsuario: usuario.idUsuario,
      cantSolicitudes:0,
      cantPrestamosOtorgadoss:0,
      cantPrestamosFinalizados:0,
    })

    const prestamista = new Prestamista({
      idPrestamista:uuid.v4(),
      idUsuario: usuario.idUsuario,
      cantOfertas:0,
      cantPrestamosActivos:0,
      cantPrestamosConcedidos:0,
      cantPrestamosFinalizados:0
    })

    const salt = bcrypt.genSaltSync();
    usuario.contraseña = bcrypt.hashSync( contraseña, salt);
    usuario.respuestaSeguridad = bcrypt.hashSync( respuestaSeguridad, salt);

    try {

      const resultado = await tieneDiferenciaDe18Anios(fechaNac);
      console.log(resultado)
      

      if(!resultado){
        return res.status(428).json({
          msg:`No cumples con la edad Necesaria, No puedes registrarte!!!`,
      })
      }

      const token = await GenearaJWT(usuario.idUsuario);
      await usuario.save();

      if((usuario.tipoUsuario === 'Prestatario')== true){
        await prestatario.save();
      }
      if((usuario.tipoUsuario === 'Prestamista')== true){
        await prestamista.save();
      }
      

      res.json({
        msg:'Usuario Creado Correctamente',
        usuario,
        token
      })

    } catch (error) {
      res.status(500).json({
        msg:'internal server error',
        error
      })
    }
  }


  const eliminarUsuario = async (req, res ) => {
    const {idUsuario}= req.params;
    try {
      const usuario = await Usuario.destroy({
        where:{idUsuario}
      });
      res.json({
        msg:'Usuario eliminado correctamente',
        usuario
    })
    } catch (error) {
      res.status(500).json({
        msg:'internal server error',
        error
      })
    }
  }


  module.exports = {
    obtenerUsuarios,
    obtenerUsuario,
    actualizarUsuario,
    crearUsuario,
    eliminarUsuario
  }