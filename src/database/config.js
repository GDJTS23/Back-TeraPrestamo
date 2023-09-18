const { Sequelize } = require ('sequelize')

const conexion = new Sequelize('teraprestamo','root','root', {
    host:'localhost',
    dialect: 'mysql'
});

module.exports = conexion;

