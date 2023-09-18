const {DataTypes} = require('sequelize');
const conexion = require ('../database/config')
const Prestamo = require ('./Prestamo_model')

const Historial = conexion.define('Historial', {
    idHistorial: {
        allowNull:false,
        primaryKey:true,
        type: DataTypes.UUIDV4
    }, 
    idPrestamo: {
        allowNull:false,
        type: DataTypes.UUIDV4,
        references: {
            model:Prestamo,
            key:"idPrestamo"
        }
    },  
    fechaAbono:{
        allowNull: false,
        type: DataTypes.DATE
    },
    abono:{
        allowNull: false,
        type: DataTypes.FLOAT
    },
},{
    modelName: 'Historial',
    tableName: 'historialMovimiento',
    underscored: false,
    timestamps: false,
    paranoid: true,

  });

  Prestamo.hasMany(Historial, {
    foreignKey: 'idPrestamo'
  });
  Historial.belongsTo(Prestamo,{
      foreignKey: 'idPrestamo'
    })

module.exports = Historial;