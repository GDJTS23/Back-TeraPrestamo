const { Router } = require ('express')
const {check,param} = require('express-validator')
const { validarCampos, validarJWT, validarROL } = require('../middlewares/index');

const {
    obtenerPrestamosHistorial,
    obtenerPrestamos,
    actualizarPrestamos,
    crearPrestamo,
    eliminarPrestamo,
    obtenerPrestamosAct
  } = require ('../controllers/prestamo_controller')

  const {
    validarIdExiste,
    ValidarPrestamo,
    ValidarSolicitud
  } = require ('../Helpers/dbValidaciones')

  const router = Router();

  router.get('/activo/:idUsuario',[
    validarJWT,
    validarROL,
    param('idUsuario').custom(validarIdExiste),
    validarCampos,
  ],obtenerPrestamosAct);

  router.get('/:idUsuario',[
    validarJWT,
    validarROL,
    param('idUsuario').custom(validarIdExiste),
    validarCampos,
  ],obtenerPrestamos);

  router.get('/inofrme/:idUsuario',[
    //validarJWT,
    //validarROL,
    param('idUsuario').custom(validarIdExiste),
    validarCampos,
  ],obtenerPrestamosHistorial);
  
  router.put('/:idUsuario',[
    validarJWT,
    validarROL,
    param('idUsuario').custom(validarIdExiste),
    check('idPrestamo', 'El Id de prestamo es obligatorio').not().isEmpty().custom(ValidarPrestamo),
    check('abonado', 'el monto abonado no es vailido').not().isEmpty().isFloat(),
    validarCampos,
  ],actualizarPrestamos);


  router.post('/:idUsuario',[
    validarJWT,
    validarROL,
    param('idUsuario').custom(validarIdExiste),
    check('montoTotal', 'el monto total no es vailido').not().isEmpty().isFloat(),
    check('cuotas', 'la cuota no es vailida').not().isEmpty().isInt(),
    check('tasaInteres', 'la tasa de interes no es vailida').not().isEmpty().isFloat(),
    check('metodoPago', 'El metodo de pago no es valido').isIn(['Transferencia','Pago Movil']),
    validarCampos,
  ],crearPrestamo);

  router.delete('/:idPrestamo',[
    validarJWT,
    validarROL,
    param('idPrestamo').custom(ValidarPrestamo),
    check('idPrestamo', 'El Id de prestamo es obligatorio').not().isEmpty().custom(ValidarPrestamo),
    validarCampos
  ],eliminarPrestamo);

  module.exports = router;
