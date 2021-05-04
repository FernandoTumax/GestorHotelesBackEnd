const Joi = require('@hapi/joi')
const log = require('./../../../utils/logger')

const blueprintHotel = Joi.object({
    name: Joi.string().max(150).required(),
    direccion: Joi.string().max(200).required()
})

let validarHotel = (req, res, next) => {
    let resultado = blueprintHotel.validate(req.body, {abortEarly:false, convert: false})
    if(resultado.error === undefined){
        next()
    }else{
        log.info('Fallo la validacion del usuario', resultado.error.details.map(err => err.message))
        res.status(400).send("Informacion no cumple con los requisitos, asegure que el hotel tenga un nombre y no pase de los 150 caracteres, tenga una direccion y no pase de los 250 caracteres")
    }
}

module.exports = {
    validarHotel
}