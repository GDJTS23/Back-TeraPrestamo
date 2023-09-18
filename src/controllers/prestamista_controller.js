const uuid = require('uuid')

const {response} = require ('express');
const Prestamista = require('../models/prestamista_model');
res = response;

const obtPrestamista = async (req, res ) => {
    const {idUsuario} = req.params;
  try {
      const prestamista = await Prestamista.findOne({where:{idUsuario}});
      res.json({
        msg:'prestamista Obetenido es:',
        prestamista
    })
    } catch (error) {
      res.status(500).json({
        msg:'internal server error',
        error
      })
    }
}

const actualizarPrestamista = async (req, res ) => {
    const {idUsuario}= req.params;
    const {...resto}=req.body;

    try {
      const prestamista = await Prestamista.update( resto, {where:{idUsuario}});
      res.json({
        msg:'prestamista Modificado correctamente',
        prestamista
        })
    } catch (error) {
      res.status(500).json({
        msg:'internal server error',
        error
      })
    }
}

const eliminarPrestamista = async (req, res ) => {
    const {idUsuario}= req.params;
    try {
      const prestamista = await Prestamista.destroy({
        where:{idUsuario}
      });
      res.json({
        msg:'prestamista eliminado correctamente',
        prestamista
    })
    } catch (error) {
      res.status(500).json({
        msg:'internal server error',
        error
      })
    }
}
module.exports = {
    obtPrestamista,
    actualizarPrestamista,
    eliminarPrestamista
}  