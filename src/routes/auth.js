const { Router } = require ('express')
const {check} = require('express-validator')
const { validarCampos } = require('../middlewares/index');
const { login } = require('../controllers/auth_controller')

const router = Router();

router.post('/login',[
  check('email', 'El correo no es valido').isEmail().not().isEmpty(),
  check('contraseña', 'la contraseña es obligatorio y debe ser un minimo de 6 caracteres').not().isEmpty(),
  check('preguntaSeguridad', 'La pregunta seleccionada no es valida').isIn(['¿Cuándo es tu cumpleaños?', '¿Cómo se llamaba tu mamá?']),
  check('respuestaSeguridad', 'La respuesta de seguradad es obligatoria').not().isEmpty(),
  validarCampos
],login);

module.exports = router;