const uuid = require('uuid')
const { Op } = require("sequelize");

const {response} = require ('express');
const Prestatario = require('../models/prestatario_model');
const Prestamista = require('../models/prestamista_model');
const Prestamo = require('../models/Prestamo_model');
const Solicitud = require('../models/solicitudes.model');
const Usuario = require('../models/user_model');
const Documento = require('../models/doc_model');


res = response;


const obtenerSolicitudes = async (req, res ) => {
    
  const {idUsuario} = req.params;

  try {

    const prestatario = await Prestatario.findOne({where:{idUsuario}})

    if(prestatario){   
        const solicitud = await Solicitud.findAll({include:{model:Prestamo},where:{idPrestatario:prestatario.idPrestatario}})
        res.json({
          msg:'Solicitudes encontrados correctamente',
          solicitud
      })
    }
    else {
        const prestamista = await Prestamista.findOne({where:{idUsuario}})
        const prestamo = await Prestamo.findAll({include:{model:Solicitud,where:{estado:'Standby'}},where:{idPrestamista:prestamista.idPrestamista}})
        res.json({
            msg:'Solicitudes encontradas correctamente',
            prestamo
        })
    }
    } catch (error) {
      res.status(500).json({
        msg:'internal server error',
        error
      })
    }
  }

  const actualizarSolicitud = async (req, res ) => {
    
    const {idUsuario} = req.params;
    const {idPrestamo, idSolicitud, estado} = req.body;

    try {

      const prestamista = await Prestamista.findOne({where:{idUsuario}})
      const solicitud = await Solicitud.findByPk(idSolicitud)
      const prestatrio = await Prestatario.findByPk(solicitud.idPrestatario)
      if (prestamista){
          if((estado=='Aceptada')==true){

            const usuarioPrestamista = await Usuario.findOne({where:{idUsuario:prestamista.idUsuario}})
            const docPrestamista = await Documento.findOne({where:{idUsuario:prestamista.idUsuario}})

            const usuarioPretatario = await Usuario.findOne({where:{idUsuario:prestatrio.idUsuario}})
            const docPrestatrio = await Documento.findOne({where:{idUsuario:prestatrio.idUsuario}})

            const prestamo = await Prestamo.update({estadoPrestamo:'Activo',
            descrip1:(usuarioPrestamista.nombre+' '+usuarioPrestamista.apellido+'\n'+'Tlf: '+usuarioPrestamista.telefono+'\n'+'Nro Bancario: '+docPrestamista.banco+docPrestamista.numCuenta), 
            descrip2:(usuarioPretatario.nombre+' '+usuarioPretatario.apellido+'\n'+'Tlf: '+usuarioPretatario.telefono+'\n'+'Nro Bancario: '+docPrestatrio.banco+docPrestatrio.numCuenta)}, 
            {where:{idPrestamo}})


            const solicitud = await Solicitud.update({estado:'Aceptada'}, {where:{idSolicitud}})
            await Solicitud.update({estado:'Rechazada'}, {where:{
              idPrestamo,
              idSolicitud:{[Op.ne]:idSolicitud}
             }})

             const prestatario = await Solicitud.findByPk(idSolicitud)
             const idPrestatario = prestatario.idPrestatario
             await Solicitud.update({estado:'Rechazada'}, {where:{idPrestatario,idSolicitud:{[Op.ne]:idSolicitud}}})

             return res.json({
              msg:'Se actualizo el prestamo y la solicitud correctamente',
              solicitud,
              prestamo
          })
          }
          if((estado=='Rechazada')==true){
            const solicitud = await Solicitud.update({estado:'Rechazada'}, {where:{idSolicitud}})
            return res.json({
              msg:'Se actualizo la solicitud correctamente',
              solicitud
            })
          } 
      }
    } catch (error) {
      res.status(500).json({
        msg:'internal server error',
        error
      })
    }
  }

const crearSolicitud = async (req, res ) => {
    
  const {idUsuario}= req.params;
  const{idPrestamo} = req.body

  try {

    const nombre = await Usuario.findByPk(idUsuario)
    const prestatario = await Prestatario.findOne({where:{idUsuario}})

      if(prestatario){
        const prestamo = await Prestamo.findByPk(idPrestamo)
        if((prestamo.estadoPrestamo=='Activo')==true || (prestamo.estadoPrestamo=='Finalizado')==true ){
            return res.status(428).json({
              msg:`Este prestamo esta Activo / Finalizado, ya no puede recibir una solicitud`,
          })
        }
        
        const idPrestatario = prestatario.idPrestatario
        const solicitudAct = await Solicitud.findOne({where:{estado:'Aceptada',idPrestatario}})
        if(solicitudAct){
          return res.status(428).json({
            msg:`No puedes tener mas de un prestamo con Estado: Activo`,
          })
        }

        let name = nombre.nomUsuario

        const solicitud = new Solicitud ({
          idSolicitud: uuid.v4(),
          idPrestatario: prestatario.idPrestatario,
          idPrestamo,
          fecha: new Date(),
          PrestatarioNom: name
        })

        const cantidad =  await Solicitud.count({where:{idPrestatario:idPrestatario}})

        await prestatario.update({cantSolicitudes:cantidad})

        await solicitud.save()

        res.json({
          msg:'Solicitud creado Correctamente',
          solicitud
        })
      }
      
    } catch (error) {
      res.status(500).json({
        msg:'internal server error',
        error
      })
    }
}


  const eliminarSolicitud= async (req, res ) => {
    const {idSolicitud}= req.body;
    try {
      const solicitud = await Solicitud.destroy({
        where:{idSolicitud}
      });
      res.json({
        msg:'Solicitud eliminado correctamente',
        solicitud
    })
    } catch (error) {
      res.status(500).json({
        msg:'internal server error',
        error
      })
    }
  }

  module.exports = {
    obtenerSolicitudes,
    actualizarSolicitud,
    crearSolicitud,
    eliminarSolicitud
  }