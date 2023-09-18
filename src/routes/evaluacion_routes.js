const { Router } = require ('express')
const {check,param} = require('express-validator')
const { validarCampos, validarJWT, validarROL} = require('../middlewares/index');

  const { 
    obtEvaluacion,
    actualizarEvaluacion,
    eliminarEvaluacion
  } = require ('../controllers/evaluacion_controller')

  const {
    validarIdExiste
  } = require ('../Helpers/dbValidaciones')

  const router = Router();

  router.get('/:idUsuario',[
    validarJWT,
    validarROL,
    param('idUsuario').custom(validarIdExiste),
    validarCampos,
  ],obtEvaluacion);

  router.put('/:idUsuario',[
    validarJWT,
    validarROL,
    param('idUsuario').custom(validarIdExiste),
    check('puntajeCrediticio', 'la cantidad de Solicitudes no es validad').not().isEmpty(),
    check('vencimiento', 'la cantidad de prestamos otrogados no es validad').not().isEmpty(),
    validarCampos
  ],actualizarEvaluacion);


  router.delete('/:idUsuario',[    
    validarJWT,
    validarROL,
    param('idUsuario').custom(validarIdExiste),
    validarCampos
  ],eliminarEvaluacion);

module.exports = router;