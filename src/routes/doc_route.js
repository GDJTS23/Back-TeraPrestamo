const { Router } = require ('express')
const {check,param} = require('express-validator')
const { validarCampos, validarJWT, validarROL} = require('../middlewares/index');

const { 
    obtenerDoc,
    crearDoc,
    actualizarDoc,
    eliminarDoc
  } = require ('../controllers/doc_controller')

  const {
    validarIdExiste,
    validarDOCUMENTO
  } = require ('../Helpers/dbValidaciones')

  const router = Router();

  router.get('/:idUsuario',[
    validarJWT,
    validarROL,
    param('idUsuario').custom(validarDOCUMENTO),
    validarCampos,
  ],obtenerDoc);
  
  router.put('/:idUsuario',[
    validarJWT,
    validarROL,
    param('idUsuario').custom(validarDOCUMENTO),
    check('numCuenta', 'El Numero de Cuenta es obligatorio').not().isEmpty(),
    check('banco', 'El Banco es obligatorio').not().isEmpty(),
    validarCampos,
  ],actualizarDoc);

  router.post('/:idUsuario',[
    validarJWT,
    validarROL,
    param('idUsuario').custom(validarIdExiste),
    check('numCuenta', 'El Numero de Cuenta es obligatorio').not().isEmpty(),
    check('banco', 'El Banco es obligatorio').not().isEmpty(),
    validarCampos,
  ],crearDoc);


  router.delete('/:idUsuario',[
    validarJWT,
    validarROL,
    param('idUsuario').custom(validarDOCUMENTO),
    validarCampos
  ],eliminarDoc);

  module.exports = router;
