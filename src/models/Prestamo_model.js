const {DataTypes} = require('sequelize');
const conexion = require ('../database/config')
const Prestamista = require ('./prestamista_model')

const Prestamo = conexion.define('Prestamo', {
    idPrestamo: {
        allowNull:false,
        primaryKey:true,
        type: DataTypes.UUIDV4
    }, 
    idPrestamista: {
        allowNull:false,
        type: DataTypes.UUIDV4,
        references: {
            model:Prestamista,
            key:"idPrestamista"
        }
    },  
    estadoPrestamo:{
        allowNull: false,
        type: DataTypes.ENUM('Standby','Activo','Finalizado'),
        validate: { isIn:{ args: [['Standby','Activo','Finalizado']]} },
        defaultValue:'Standby'
    },
    cuotas:{
        allowNull: false,
        type: DataTypes.INTEGER
    },
    tasaInteres:{
        allowNull: false,
        type: DataTypes.FLOAT
    },
    abonado:{
        allowNull: false,
        type: DataTypes.FLOAT,
        defaultValue:0
    },
    montoTotal:{
        allowNull: false,
        type: DataTypes.FLOAT
    },
    deuda:{
        allowNull: false,
        type: DataTypes.FLOAT
    },
    fechaInicio:{
        allowNull: false,
        type: DataTypes.DATE
    },
    fechaFinal:{
        allowNull: true,
        type: DataTypes.DATE,
        defaultValue: null
    },    
    metodoPago:{
        allowNull: true,
        type: DataTypes.ENUM('Transferencia','Pago Movil'),
        validate: { isIn:{ args: [['Transferencia','Pago Movil']]} },
    },
},{
    modelName: 'Prestamo',
    tableName: 'Prestamos',
    underscored: false,
    timestamps: false,
    paranoid: true,

  });
Prestamista.hasMany(Prestamo, {
  foreignKey: 'idPrestamista'
});
Prestamo.belongsTo(Prestamista,{
    foreignKey: 'idPrestamista'
  })

module.exports = Prestamo;