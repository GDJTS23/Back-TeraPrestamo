const {DataTypes} = require('sequelize');
const conexion = require ('../database/config')
const Usuario = require ('./user_model')

const Prestamista = conexion.define('Prestamista', {
    idPrestamista: {
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
    cantOfertas:{
        allowNull: false,
        type: DataTypes.INTEGER
    },
    cantPrestamosActivos:{
        allowNull: false,
        type: DataTypes.INTEGER
    },
    cantPrestamosConcedidos:{
        allowNull: false,
        type: DataTypes.INTEGER
    },
    cantPrestamosFinalizados:{
        allowNull: false,
        type: DataTypes.INTEGER
    }
},{
    modelName: 'Prestamista',
    tableName: 'perfilPrestamistas',
    underscored: false,
    timestamps: false,
    paranoid: true,

  });
/*Documento.hasOne(Usuario, {
    foreignKey: 'idUsuario'
});
Documento.belongsTo(Usuario);*/

module.exports = Prestamista;