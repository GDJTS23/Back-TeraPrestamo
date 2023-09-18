const {DataTypes} = require('sequelize');
const conexion = require ('../database/config')
const Usuario = require ('./user_model')

const Prestatario = conexion.define('Prestatario', {
    idPrestatario: {
        allowNull:false,
        primaryKey:true,
        type: DataTypes.UUIDV4
    }, 
    idUsuario: {
        allowNull:false,
        type: DataTypes.UUIDV4,
        references: {
            model:Usuario,
            key:"idUsuario"
        }
    },  
    cantSolicitudes:{
        allowNull: false,
        type: DataTypes.INTEGER
    },
    cantPrestamosOtorgadoss:{
        allowNull: false,
        type: DataTypes.INTEGER
    },
    cantPrestamosFinalizados:{
        allowNull: false,
        type: DataTypes.INTEGER
    },
},{
    modelName: 'Prestatario',
    tableName: 'perfilPrestatarios',
    underscored: false,
    timestamps: false,
    paranoid: true,

  });
/*Documento.hasOne(Usuario, {
    foreignKey: 'idUsuario'
});
Documento.belongsTo(Usuario);*/

module.exports = Prestatario;