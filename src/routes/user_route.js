const { Router } = require ('express')
const {check,param} = require('express-validator')
const { validarCampos, validarJWT, validarROL} = require('../middlewares/index');

const {validarCorreoExiste,
  validarNombreUsuarioExiste,
  validarCedulaExiste,
  validarIdExiste
} = require ('../Helpers/dbValidaciones')

const { 
  obtenerUsuarios,
  obtenerUsuario,
  actualizarUsuario,
  crearUsuario,
  eliminarUsuario 
} = require ('../controllers/user_controller')

const router = Router();

router.get('/:idUsuario',[
  validarJWT,
  validarROL,
  param('idUsuario').custom(validarIdExiste),
  validarCampos,
],obtenerUsuario);

router.get('/',obtenerUsuarios); 

router.put('/:idUsuario',
validarJWT,
validarROL,
  param('idUsuario').custom(validarIdExiste).optional(),
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('apellido', 'El apellido es obligatorio').not().isEmpty(),
  check('telefono', 'El telefono es obligatorio').not().isEmpty(),
  check('nomUsuario', 'El Nombre de Usuario es obligatorio').not().isEmpty().custom(validarNombreUsuarioExiste).optional(),
  validarCampos,
actualizarUsuario);

router.post('/', [
  check('nombre', 'El nombre no es valido').notEmpty().not().isNumeric(),
  check('apellido', 'El apellido no es valido').notEmpty().not().isNumeric(),
  check('cedula', 'La cédula es obligatoria y debe tener 7 u 8 caracteres').not().isEmpty().isLength({min:7,max:8}).custom(validarCedulaExiste),
  check('email', 'El correo no es valido').isEmail().not().isEmpty().custom(validarCorreoExiste),
  check('telefono', 'El telefono es obligatorio y debe tener 11 caracteres').not().isEmpty().isLength({min:11,max:11}),
  check('nomUsuario', 'El Nombre de Usuario es obligatorio').not().isEmpty().custom(validarNombreUsuarioExiste),
  check('contraseña', 'La contraseña es obligatorio y debe ser un minimo de 6 caracteres').not().isEmpty().isLength({min:6}),
  check('preguntaSeguridad', 'La pregunta seleccionada no es valida').isIn(['¿Cuándo es tu cumpleaños?', '¿Cómo se llamaba tu mamá?']),
  check('respuestaSeguridad', 'La respuesta de seguradad es obligatoria').not().isEmpty(),
  check('tipoUsuario', 'El Tipo de Usuario no es valido').isIn(['Prestamista', 'Prestatario']),
  check('fechaNac', 'Fecha no valida. Intente de nuevo').toDate(),
  validarCampos,
],crearUsuario);

router.delete('/:idUsuario',[
  param('idUsuario').custom(validarIdExiste),
  validarCampos,
],eliminarUsuario);

module.exports = router;