const {DataTypes} = require('sequelize');
const conexion = require ('../database/config')
const Prestatrio = require ('./prestatario_model')

const Evaluacion = conexion.define('Evaluacion', {
    idEvaluacion: {
        allowNull:false,
        primaryKey:true,
        type: DataTypes.UUIDV4
    }, 
    idPrestatario: {
        allowNull:false,
        type: DataTypes.UUIDV4,
        references: {
            model:Prestatrio,
            key:"idPrestatario"
        }
    },  
    puntajeCrediticio:{
        allowNull: false,
        type: DataTypes.INTEGER
    },
    vencimiento:{
        allowNull: false,
        type: DataTypes.DATE
    },
},{
    modelName: 'Evaluacion',
    tableName: 'evaluacionCrediticia',
    underscored: false,
    timestamps: false,
    paranoid: true,

  });
/*Documento.hasOne(Usuario, {
    foreignKey: 'idUsuario'
});
Documento.belongsTo(Usuario);*/

module.exports = Evaluacion;