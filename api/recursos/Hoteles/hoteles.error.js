class HotelNoExiste extends Error{
    constructor(message){
        super(message)
        this.name = message || 'El hotel no existe en la base de datos'
        this.status = 204
        this.name = "HotelNoExiste"
    }
}

class RolInvalido extends Error{
    constructor(message){
        super(message)
        this.name = message || 'El Rol del usuario no tiene los permisos para esta accion'
        this.status = 404
        this.name = "RolInvalido"
    }
}

class HotelExistente extends Error{
    constructor(message){
        super(message)
        this.name = message || 'El hotel que se quiere crear ya existe en la base de datos'
        this.status = 400
        this.name = 'HotelExistente'
    }
}

module.exports = {
    HotelNoExiste,
    RolInvalido,
    HotelExistente
}