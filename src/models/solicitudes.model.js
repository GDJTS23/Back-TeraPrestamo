const {DataTypes} = require('sequelize');
const conexion = require ('../database/config')
const Prestamo = require('./Prestamo_model');
const Prestatario = require('./prestatario_model');

const Solicitud = conexion.define('Solicitud', {
    idSolicitud: {
        allowNull:false,
        primaryKey:true,
        type: DataTypes.UUIDV4
    }, 
    idPrestatario: {
        allowNull:false,
        type: DataTypes.UUIDV4,
        references: {
            model:Prestatario,
            key:"idPrestatario"
        }
    },
    idPrestamo: {
        allowNull:false,
        type: DataTypes.UUIDV4,
        references: {
            model:Prestamo,
            key:"idPrestamo"
        }
    },  
    estado:{
        allowNull: false,
        type: DataTypes.ENUM('Standby','Aceptada','Rechazada','Finalizado'),
        validate: { isIn:{ args: [['Standby','Aceptada','Rechazada','Finalizado']]} },
        defaultValue:'Standby'
    },
    fecha:{
        allowNull: false,
        type: DataTypes.DATE
    },
    PrestatarioNom:{
        allowNull: false,
        type: DataTypes.STRING
    }
},{
    modelName: 'Solicitud',
    tableName: 'solicitudPrestamos',
    underscored: false,
    timestamps: false,
    paranoid: true,

  });
  Prestatario.hasMany(Solicitud, {
    foreignKey: 'idPrestatario'
  });
  Solicitud.belongsTo(Prestatario,{
      foreignKey: 'idPrestatario'
    });
    Prestamo.hasMany(Solicitud, {
    foreignKey: 'idPrestamo'
    });
    Solicitud.belongsTo(Prestamo,{
      foreignKey: 'idPrestamo'
    });
  

module.exports = Solicitud;