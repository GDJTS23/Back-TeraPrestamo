const Evaluacion = require ('../models/evaluacion_model');
const Prestatrio = require ('../models/prestatario_model');
const {response} = require ('express');
res = response;

const obtEvaluacion = async (req, res ) => {
    const {idUsuario} = req.params;
  try {
    const prestatario = await Prestatrio.findOne({where:{idUsuario}})
    const idPrestatario = prestatario.idPrestatario
    const evaluacion = await Evaluacion.findOne({where:{idPrestatario}})

      res.json({
        msg:'Evaluacion Obetenido es:',
        evaluacion
    })
    } catch (error) {
      res.status(500).json({
        msg:'internal server error',
        error
      })
    }
}

const actualizarEvaluacion = async (req, res ) => {
    const {idUsuario}= req.params;
    const {...resto}=req.body;

    try {
        const prestatario = await Prestatrio.findOne({where:{idUsuario}})
        const idPrestatario = prestatario.idPrestatario
        const evaluacion = await Evaluacion.update( resto, {where:{idPrestatario}});
      
      res.json({
        msg:'Evaluacion Modificado correctamente',
        evaluacion
        })
    } catch (error) {
      res.status(500).json({
        msg:'internal server error',
        error
      })
    }
}

const eliminarEvaluacion = async (req, res ) => {
    const {idUsuario}= req.params;
    try {
        const prestatario = await Prestatrio.findOne({where:{idUsuario}})
        const idPrestatario = prestatario.idPrestatario
      const evaluacion = await evaluacion.destroy({
        where:{idPrestatario}
      });
      res.json({
        msg:'evaluacion eliminado correctamente',
        evaluacion
    })
    } catch (error) {
      res.status(500).json({
        msg:'internal server error',
        error
      })
    }
}
module.exports = {
    obtEvaluacion,
    actualizarEvaluacion,
    eliminarEvaluacion
}  