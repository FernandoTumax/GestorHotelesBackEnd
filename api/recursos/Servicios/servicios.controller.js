const Servicio = require('./servicios.model')

function foundServices(){
    return Servicio.find({})
}

function createServices(service){
    return new Servicio({
        ...service
    }).save();
}

function deleteServices(id){
    return Servicio.findByIdAndRemove(id);
}

function foundOneService({id: id, tipoServicio: tipoServicio}){
    if(id){
        return Servicio.findById(id);
    }else if(tipoServicio){
        return Servicio.findOne({tipoServicio: tipoServicio})
    }
    throw new Error('Funcion obtener servicio del controlador fue llamado sin especificar el id o el nombre del Servicio')
}

module.exports = {
    foundServices,
    createServices,
    deleteServices,
    foundOneService
}