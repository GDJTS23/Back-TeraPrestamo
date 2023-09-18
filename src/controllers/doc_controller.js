const {response} = require ('express');


const uuid = require('uuid')
const Documento = require ('../models/doc_model');
const Evaluacion =  require('../models/evaluacion_model')
const Prestatrio = require ('../models/prestatario_model');

const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL );


res = response;

const obtenerDoc = async (req, res ) => {
    const {idUsuario} = req.params;
  try {
      const documento = await Documento.findOne({where:{idUsuario}});
      res.json({
        msg:'Documentos encontrado correctamente',
        documento
    })
    } catch (error) {
      res.status(500).json({
        msg:'internal server error',
        error
      })
    }
}


const crearDoc = async (req, res ) => {

    const {idUsuario}= req.params;
    const {
        numCuenta,
        banco
    } = req.body

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ msg: 'No hay archivo que desplegar'});
    }

    try {     

      const prestatario = await Prestatrio.findOne({where:{idUsuario}});

      var fecha = new Date(Date.now())

      if(prestatario){
        const evaluacion = new Evaluacion ({
          idEvaluacion: uuid.v4(),
          idPrestatario: prestatario.idPrestatario,
          puntajeCrediticio: Math.floor((Math.random() * (20 - 10 + 1)) + 10),
          vencimiento: fecha.setDate(fecha.getDate() + 60),
        })
        await evaluacion.save();
      }

        const doc = await Documento.findOne({where:{idUsuario}});

        if(!doc){
          const cedula = req.files.archivoCed
          const Path_Ced = await cloudinary.uploader.upload(cedula.tempFilePath);
      
          const referencia = req.files.archivoRef
          const Path_Ref = await cloudinary.uploader.upload(referencia.tempFilePath);
      
          const estado = req.files.archivoEst
          const Path_Est = await cloudinary.uploader.upload(estado.tempFilePath);
      
          const documento = new Documento ({
              idDocumento: uuid.v4(),
              idUsuario,
              numCuenta,
              banco,
              docCedula:Path_Ced.secure_url,
              docReferencia: Path_Ref.secure_url,
              docEstado: Path_Est.secure_url
          })

            await documento.save();
                res.status(200).json({
                  msg:'Los Documentos se guardaron correctamente',
                  documento
                })
        }else{
          const cedula = req.files.archivoCed
          const Path_Ced = await cloudinary.uploader.upload(cedula.tempFilePath);
      
          const referencia = req.files.archivoRef
          const Path_Ref = await cloudinary.uploader.upload(referencia.tempFilePath);
      
          const estado = req.files.archivoEst
          const Path_Est = await cloudinary.uploader.upload(estado.tempFilePath);

          doc.update( {                
            numCuenta,
            banco,
            docCedula:Path_Ced.secure_url,
            docReferencia: Path_Ref.secure_url,
            docEstado: Path_Est.secure_url});

                res.status(201).json({
                  msg:'Los Documentos se actualizaron correctamente',
                  doc
                })
        }
      } catch (error) {
        res.status(500).json({
          msg:'internal server error',
          error
        })
      }
}


const actualizarDoc = async (req, res ) => {
    const {idUsuario}= req.params;
    const {numCuenta,banco,}=req.body;
    try {

      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ msg: 'No hay archivo que desplegar'});
      }
          
      const cedula = req.files.archivoCed
      const Path_Ced = await cloudinary.uploader.upload(cedula.tempFilePath);
  
      const referencia = req.files.archivoRef
      const Path_Ref = await cloudinary.uploader.upload(referencia.tempFilePath);

      const estado = req.files.archivoEst
      const Path_Est = await cloudinary.uploader.upload(estado.tempFilePath);


      const documento = await Documento.update( {                
        numCuenta,
        banco,
        docCedula:Path_Ced.secure_url,
        docReferencia: Path_Ref.secure_url,
        docEstado: Path_Est.secure_url}, {where:{idUsuario}});
      res.json({
        msg:'Los Docuemntos se han Modificado correctamente',
        documento
    })
    } catch (error) {
      res.status(500).json({
        msg:'internal server error',
        error
      })
    }

}
const eliminarDoc = async (req, res ) => {
    const {idUsuario}= req.params;
    try {
      const documento = await Documento.destroy({
        where:{idUsuario}
      });
      res.json({
        msg:'Los documentos fueron eliminnados',
        documento
    })
    } catch (error) {
      res.status(500).json({
        msg:'internal server error',
        error
      })
    }
}

module.exports = {
    obtenerDoc,
    crearDoc,
    actualizarDoc,
    eliminarDoc
}
  