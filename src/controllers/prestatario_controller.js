const uuid = require('uuid')

const Prestatrio = require ('../models/prestatario_model');
const {response} = require ('express');
res = response;

const obtPrestatario = async (req, res ) => {
    const {idUsuario} = req.params;
  try {
      const prestatario = await Prestatrio.findOne({where:{idUsuario}});
      res.json({
        msg:'Prestatario Obetenido es:',
        prestatario
    })
    } catch (error) {
      res.status(500).json({
        msg:'internal server error',
        error
      })
    }
}

const actualizarPrestatario = async (req, res ) => {
    const {idUsuario}= req.params;
    const {...resto}=req.body;

    try {
      const prestatario = await Prestatrio.update( resto, {where:{idUsuario}});
      res.json({
        msg:'prestatario Modificado correctamente',
        prestatario
        })
    } catch (error) {
      res.status(500).json({
        msg:'internal server error',
        error
      })
    }
}

const eliminarPrestatario = async (req, res ) => {
    const {idUsuario}= req.params;
    try {
      const prestatario = await Prestatrio.destroy({
        where:{idUsuario}
      });
      res.json({
        msg:'prestatario eliminado correctamente',
        prestatario
    })
    } catch (error) {
      res.status(500).json({
        msg:'internal server error',
        error
      })
    }
}
module.exports = {
    obtPrestatario,
    actualizarPrestatario,
    eliminarPrestatario
}  