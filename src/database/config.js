const { Sequelize } = require ('sequelize')

const conexion = new Sequelize(process.env.DB_DBNAME,process.env.DB_USERNAME,process.env.DB_PASSWORD, {
    host:process.env.DB_HOST,
    dialect: 'mysql'
});

module.exports = conexion;

