const {DataTypes} = require('sequelize');
const conexion = require ('../database/config')
const Usuario = require ('./user_model')

const Documento = conexion.define('Documento', {
    idDocumento: {
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
    numCuenta:{
        allowNull: false,
        type: DataTypes.STRING
    },
    banco:{
        allowNull: false,
        type: DataTypes.STRING
    },
    docCedula:{
        allowNull: false,
        type: DataTypes.STRING,
    },
    docReferencia:{
        allowNull: false,
        type: DataTypes.STRING,
    },
    docEstado:{
        allowNull: false,
        type: DataTypes.STRING,
    }
},{
    modelName: 'Documento',
    tableName: 'documentos',
    underscored: false,
    timestamps: false,
    paranoid: true,

  });
Usuario.hasOne(Documento, {
    foreignKey: 'idUsuario'
});
Documento.belongsTo(Usuario,{
    foreignKey: 'idUsuario'
  });

module.exports = Documento;