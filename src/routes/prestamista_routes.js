const { Router } = require ('express')
const {check,param} = require('express-validator')
const { validarCampos, validarJWT,validarROL } = require('../middlewares/index');

const { 
    obtPrestamista,
    actualizarPrestamista,
    eliminarPrestamista
  } = require ('../controllers/prestamista_controller')

  
  const {
    validarIdExiste
  } = require ('../Helpers/dbValidaciones')

  const router = Router();

  router.get('/:idUsuario',[
    validarJWT,
    validarROL,
    param('idUsuario').custom(validarIdExiste),
    validarCampos,
  ],obtPrestamista);

  router.put('/:idUsuario',[
    validarJWT,
    validarROL,
    param('idUsuario').custom(validarIdExiste),
    check('cantOfertas', 'la cantidad de ofertas no es validad').isInt().not().isEmpty(),
    check('cantPrestamosActivos', 'la cantidad de prestamos activos no es validad').isInt().not().isEmpty(),
    check('cantPrestamosConcedidos', 'la cantidad de prestamos concedidos no es validad').isInt().not().isEmpty(),
    check('cantPrestamosFinalizados', 'la cantidad de prestamos finalizados no es validad').isInt().not().isEmpty(),
    validarCampos
  ],actualizarPrestamista);


  router.delete('/:idUsuario',[    
    validarJWT,
    validarROL,
    param('idUsuario').custom(validarIdExiste),
    validarCampos
],eliminarPrestamista);

  module.exports = router;