const { Router } = require ('express')
const {check,param} = require('express-validator')
const { validarCampos, validarJWT, validarROL } = require('../middlewares/index');

const { 
    obtPrestatario,
    actualizarPrestatario,
    eliminarPrestatario
  } = require ('../controllers/prestatario_controller')

  
  const {
    validarIdExiste
  } = require ('../Helpers/dbValidaciones')

  const router = Router();

  router.get('/:idUsuario',[
    validarJWT,
    validarROL,
    param('idUsuario').custom(validarIdExiste),
    validarCampos,
  ],obtPrestatario);

  router.put('/:idUsuario',[
    validarJWT,
    validarROL,
    param('idUsuario').custom(validarIdExiste),
    check('cantSolicitudes', 'la cantidad de Solicitudes no es validad').isInt().not().isEmpty(),
    check('cantPrestamosOtorgadoss', 'la cantidad de prestamos otrogados no es validad').isInt().not().isEmpty(),
    check('cantPrestamosFinalizados', 'la cantidad de prestamos finalizados no es validad').isInt().not().isEmpty(),
    validarCampos
  ],actualizarPrestatario);


  router.delete('/:idUsuario',[    
    validarJWT,
    validarROL,
    param('idUsuario').custom(validarIdExiste),
    validarCampos
],eliminarPrestatario);

  module.exports = router;