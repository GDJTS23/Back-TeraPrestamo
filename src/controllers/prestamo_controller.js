const uuid = require('uuid')
const { Op } = require("sequelize");

const {response} = require ('express');
const Prestatario = require('../models/prestatario_model');
const Prestamista = require('../models/prestamista_model');
const Prestamo = require('../models/Prestamo_model');
const Evaluacion = require('../models/evaluacion_model');
const Solicitud = require('../models/solicitudes.model');
const Historial = require('../models/historialMov_model');
const Usuario = require('../models/user_model');
const Documento = require('../models/doc_model');


res = response;



const obtenerPrestamosHistorial = async (req,res) => {
  const {idUsuario}= req.params;
  
  const prestamista = await Prestamista.findOne({where:{idUsuario}})

  const prestatario = await Prestatario.findOne({where:{idUsuario}})
  

  try {

    if(prestatario){      
      const solicitud = await Solicitud.findAll({include:{model:Prestamo,estadoPrestamo:{[Op.or]: ['Finalizado','Activo']},include:{model:Historial}},where:{idPrestatario:prestatario.idPrestatario,estado:{[Op.or]: ['Aceptada','Finalizado']}}})
      return res.json({
        msg:'Prestamos encontrados correctamente',
        solicitud
    })
    }
    if(prestamista){        
      const prestamo = await Prestamo.findAll({include:{model:Historial},where:{idPrestamista:prestamista.idPrestamista,estadoPrestamo:{[Op.or]: ['Finalizado','Activo']}}})
      return res.json({
        msg:'Prestamos encontrados correctamente',
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


const obtenerPrestamos = async (req, res ) => {
    
  const {idUsuario} = req.params;

  try {

    const prestatario = await Prestatario.findOne({where:{idUsuario}})

    if(prestatario){
      const evaluacion = await Evaluacion.findOne({where:{idPrestatario:prestatario.idPrestatario}})
      if(!evaluacion){
        return res.status(428).json({
          msg:`Este usuario con id:${idUsuario} debe cargar documentos`,
      })
      }

      if(evaluacion.puntajeCrediticio >= 10 && evaluacion.puntajeCrediticio < 15){
        const prestamo = await Prestamo.findAll({where:{montoTotal:{[Op.lte]: 15000},estadoPrestamo:'Standby'}})
        res.json({
          msg:'Prestamos encontrados correctamente',
          prestamo
      })
      }
      if(evaluacion.puntajeCrediticio >= 15 && evaluacion.puntajeCrediticio < 18){
        const prestamo = await Prestamo.findAll({where:{montoTotal:{[Op.lte]: 20000},estadoPrestamo:'Standby'}})
        res.json({
          msg:'Prestamos encontrados correctamente',
          prestamo
      })
      }
      if(evaluacion.puntajeCrediticio >=18 ){
        const prestamo = await Prestamo.findAll({where:{estadoPrestamo:'Standby'}})
        res.json({
          msg:'Prestamos encontrados correctamente',
          prestamo
      })
      }
    }
    else {
      const prestamista = await Prestamista.findOne({where:{idUsuario}})
      const idPrestamista= prestamista.idPrestamista
      const prestamo = await Prestamo.findAll({where:{idPrestamista}})
      res.json({
        msg:'Prestamos encontrado correctamente',
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
  const obtenerPrestamosAct = async (req, res ) => {
    const {idUsuario} = req.params;
    try {
  
      const prestatario = await Prestatario.findOne({where:{idUsuario}})
      const idPrestatario = prestatario.idPrestatario
 
      if(prestatario){
        const solicitud = await Solicitud.findOne({where:{idPrestatario:idPrestatario, estado:'Aceptada'}})
        if (!solicitud){
          return res.status(428).json({
            msg:`No tienes ningun Prestamo Activo`,
        })
        }
        const idPrestamo=solicitud.idPrestamo
        const prestamo = await Prestamo.findByPk(idPrestamo)
          res.json({
            msg:'Prestamo encontrado correctamente',
            prestamo
        })
      }
      else {
        return res.status(428).json({
          msg:`No tienes Accesos a este EndPoint`,
      })
      }
      } catch (error) {
        res.status(500).json({
          msg:'internal server error',
          error
        })
      }
    }

  const actualizarPrestamos = async (req, res ) => {

    const {idUsuario} = req.params;
    const {idPrestamo, abonado} = req.body;

    try {
      const prestatario = await Prestatario.findOne({where:{idUsuario}})
      const idPrestatario = prestatario.idPrestatario

      
      const solicitud = await Solicitud.findOne({where:{idPrestamo}})
      const idSolicitud= solicitud.idSolicitud
      
      const prestamo = await Prestamo.findByPk(idPrestamo);
      const idPrestamista=prestamo.idPrestamista
      const prestamista = await Prestamista.findByPk(idPrestamista)
      

      if(prestatario){

        const totalabonado = prestamo.abonado + abonado;

        const movimiento = new Historial({
          idHistorial:uuid.v4(),
          idPrestamo:idPrestamo,
          fechaAbono: new Date(),
          abono: abonado
        })

        if((prestamo.montoTotal*(prestamo.tasaInteres/100+1))==prestamo.abonado){
          return res.status(428).json({
            msg:`El Prestamo ya esta saldado`,
          })
        }
        if(totalabonado>(prestamo.montoTotal*(prestamo.tasaInteres/100+1))){
          return res.status(428).json({
            msg:`El monto de abono supera el monto total, pruebe con un monto menor`,
        })
        }

        if(abonado===prestamo.deuda){
          await prestamo.update( {abonado:totalabonado,deuda:0,estadoPrestamo:'Finalizado',fechaFinal:new Date()}, {where:{idPrestamo}});
          const solicitud = await Solicitud.update({estado:'Finalizado'}, {where:{idSolicitud}});
          await movimiento.save();
          
          // cantidades Prestatario
          const cantidadF =  await Solicitud.count({where:{estado:'Finalizado',idPrestatario:idPrestatario}})
          await prestatario.update({cantPrestamosOtorgadoss:(cantidadF),cantPrestamosFinalizados:(cantidadF)})

          // cantidaes Prestatarios
          const cantActivos = await Prestamo.count({where:{estadoPrestamo:'Activo',idPrestamista:idPrestamista}})
          const cantFinalizados = await Prestamo.count({where:{estadoPrestamo:'Finalizado',idPrestamista:idPrestamista}})
          await prestamista.update({
            cantPrestamosActivos:cantActivos,
            cantPrestamosConcedidos:(cantActivos+cantFinalizados),
            cantPrestamosFinalizados:cantFinalizados
          })

          return res.status(200).json({
            msg:'Prestamo saldado',
            prestamo,
            solicitud
        })
        }else{
          await prestamo.update( {abonado:totalabonado,deuda:(prestamo.deuda-totalabonado),estadoPrestamo:'Activo'}, {where:{idPrestamo}});
          await movimiento.save();

          // cantidades Prestatario
          const cantidadF =  await Solicitud.count({where:{estado:'Finalizado',idPrestatario:idPrestatario}})
          await prestatario.update({cantPrestamosOtorgadoss:(cantidadF),cantPrestamosFinalizados:(cantidadF)})

          // cantidaes Prestatarios
          const cantActivos = await Prestamo.count({where:{estadoPrestamo:'Activo',idPrestamista:idPrestamista}})
          const cantFinalizados = await Prestamo.count({where:{estadoPrestamo:'Finalizado',idPrestamista:idPrestamista}})
          await prestamista.update({
            cantPrestamosActivos:cantActivos,
            cantPrestamosConcedidos:(cantActivos+cantFinalizados),
            cantPrestamosFinalizados:cantFinalizados
          })
          return res.status(201).json({
            msg:'Se ha abonado correctamente',
            prestamo
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

const crearPrestamo = async (req, res ) => {
    
  const {idUsuario}= req.params;

  try {

    const prestamista = await Prestamista.findOne({where:{idUsuario}})
    const  idPrestamista = prestamista.idPrestamista

    const {
      cuotas,
      tasaInteres,
      montoTotal,
      metodoPago
    } = req.body;

    const prestamo = new Prestamo({
      idPrestamo : uuid.v4(),
      idPrestamista:idPrestamista,
      fechaInicio: new Date(),
      cuotas,
      tasaInteres,
      deuda:(montoTotal*(tasaInteres/100+1)),
      montoTotal,
      metodoPago,
      descrip1:null,
      descrip2:null,
    })

    const cantidad = await Prestamo.count({where:{idPrestamista:idPrestamista}})
    await prestamista.update({cantOfertas:cantidad})

    await prestamo.save();
      res.json({
        msg:'Oferta de Prestamo Creado Correctamente',
        prestamo
      })

    } catch (error) {
      res.status(500).json({
        msg:'internal server error',
        error
      })
    }
}


  const eliminarPrestamo= async (req, res ) => {
    const {idPrestamo}= req.params;
    try {
      const prestamo = await Prestamo.findByPk(idPrestamo)

      if((prestamo.estadoPrestamo=='Finalizado')==true){
        await prestamo.destroy();
        return res.json({
          msg:'Prestamo eliminado correctamente',
      })
      }
      return res.status(428).json({
        msg:`No se puede Eliminar un prestamo sin que este Finalizado`,
    })
    } catch (error) {
      res.status(500).json({
        msg:'internal server error',
        error
      })
    }
  }

  module.exports = {
    obtenerPrestamosHistorial,
    obtenerPrestamos,
    actualizarPrestamos,
    crearPrestamo,
    eliminarPrestamo,
    obtenerPrestamosAct
  }