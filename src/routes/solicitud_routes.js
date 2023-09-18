const { Router } = require ('express')
const {check,param} = require('express-validator')
const { validarCampos, validarJWT,validarROL } = require('../middlewares/index');

const { 
    obtenerSolicitudes,
    actualizarSolicitud,
    crearSolicitud,
    eliminarSolicitud
  } = require ('../controllers/solicitudes_controller')

  const {
    validarIdExiste,
    ValidarPrestamo,
    ValidarSolicitud
  } = require ('../Helpers/dbValidaciones')

  const router = Router();

  router.get('/:idUsuario',[
    validarJWT,
    validarROL,
    param('idUsuario').custom(validarIdExiste),
    validarCampos,
  ],obtenerSolicitudes);
  
  router.put('/:idUsuario',[
    validarJWT,
    validarROL,
    param('idUsuario').custom(validarIdExiste),
    check('idPrestamo', 'El Id de prestamo es obligatorio').not().isEmpty().custom(ValidarPrestamo),
    check('idSolicitud', 'El Id de solicitud es obligatorio').not().isEmpty().custom(ValidarSolicitud),
    check('estado', 'el estado no es vailido').isIn(['Standby','Aceptada','Rechazada','Finalizado']),
    validarCampos,
  ],actualizarSolicitud);

  router.post('/:idUsuario',[
    validarJWT,
    validarROL,
    param('idUsuario').custom(validarIdExiste),
    check('idPrestamo', 'El Id de prestamo es obligatorio').not().isEmpty().custom(ValidarPrestamo),
    validarCampos,
  ],crearSolicitud);


  router.delete('/:idUsuario',[
    validarJWT,
    validarROL,
    param('idUsuario').custom(validarIdExiste),
    check('idSolicitud', 'El Id de solicitud es obligatorio').not().isEmpty().custom(ValidarSolicitud),
    validarCampos
  ],eliminarSolicitud);

  module.exports = router;
