const { Sequelize } = require ('sequelize')

const conexion = new Sequelize(process.env.teraprestamo,process.env.DB_USERNAME,process.env.DB_PASSWORD, {
    host:process.env.DB_HOST,
    dialect: 'mysql'
});

module.exports = conexion;

