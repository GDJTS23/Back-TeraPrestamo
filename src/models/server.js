const express = require('express')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const conexion = require ('../database/config')

class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth: '/auth',
            user: '/user',
            doc: '/user/doc',
            prestatario:'/user/prestatario',
            prestamista:'/user/prestamista',
            evalaucion:'/prestatario/evaluacion',
            solicitud:'/solicitud',
            Prestamo:'/prestamo'
        }

        //database
        this.conectarDB();
        
        //middlewares
        this.middlewares();

        //rutas
        this.routes();
    }

    async conectarDB(){
        try {
            await conexion.authenticate();
            console.log('Data base Conectada')
        } catch (error) {
            throw error
        }
    }

    middlewares(){
        this.app.use(express.json());
        this.app.use(cors());
        this.app.use(express.static('public'));
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/'
        }));
    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth')),
        this.app.use(this.paths.user, require('../routes/user_route')),
        this.app.use(this.paths.doc, require('../routes/doc_route')),
        this.app.use(this.paths.prestatario, require('../routes/prestatario_routes')),
        this.app.use(this.paths.prestamista, require('../routes/prestamista_routes')),
        this.app.use(this.paths.solicitud, require('../routes/solicitud_routes')),
        this.app.use(this.paths.Prestamo, require('../routes/prestamo_routes')),
        this.app.use(this.paths.evalaucion, require('../routes/evaluacion_routes'))
    }

    listen(){
        this.app.listen(this.port, ()=>{
            console.log('Servidor corriendo en el puerto', this.port)
        });
    }

}
module.exports = Server;