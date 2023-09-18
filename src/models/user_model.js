const {DataTypes} = require('sequelize');
const conexion = require ('../database/config')

const Usuario = conexion.define('Usuario', {
    idUsuario:{
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUIDV4
    },
    nombre:{
        allowNull: false,
        type: DataTypes.STRING
    },
    apellido:{
        allowNull: false,
        type: DataTypes.STRING
    },
    cedula:{
        allowNull: false,
        type: DataTypes.STRING,
    },
    email:{
        allowNull: false,
        type: DataTypes.STRING,
    },
    telefono:{
        allowNull: false,
        type: DataTypes.STRING,
    },
    nomUsuario:{
        allowNull: false,
        type: DataTypes.STRING,
    },
    contraseña:{
        allowNull: false,
        type: DataTypes.STRING,
    },
    preguntaSeguridad:{
        allowNull: false,
        type: DataTypes.ENUM('¿Cuándo es tu cumpleaños?', '¿Cómo se llamaba tu mamá?'),
        validate: { isIn:{ args: [['¿Cuándo es tu cumpleaños?', '¿Cómo se llamaba tu mamá?']], msg:'La pregunta seleccionada no es valida'} }
    },
    respuestaSeguridad:{
        allowNull: false,
        type: DataTypes.STRING,
    },
    tipoUsuario:{
        allowNull: false,
        type: DataTypes.ENUM('Prestamista', 'Prestatario'),
        validate: { isIn:{ args: [['Prestamista','Prestatario']], msg:'El Tipo de Usuario no es valido, cambialo'} }
    }, 
    fechaNac:{
        allowNull: false,
        type: DataTypes.DATE
    },
},{
    modelName: 'Usuario',
    tableName: 'usuarios',
    underscored: false,
    timestamps: false,
    paranoid: true,

  });

module.exports = Usuario;