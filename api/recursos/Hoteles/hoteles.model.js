const mongoose = require('mongoose')

const hotelSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 1,
        required: [true, 'Hotel debe tener un nombre']
    },
    direccion: {
        type: String,
        minlength: 1,
        required: [true, 'Hotel debe tener una direccion']
    },
    solicitud: {
        type: Number,
        required: [true, 'Hotel debe tener las solicitudes']
    },
    reservation: [{type: mongoose.Schema.ObjectId, ref:'reservacion'}],
    room : [{type: mongoose.Schema.ObjectId, ref:'habitacion'}],
    event: [{type: mongoose.Schema.ObjectId, ref:'evento'}],
    service: [{type: mongoose.Schema.ObjectId, ref:'servicio'}],
    user: [{type: mongoose.Schema.ObjectId, ref:'usuario'}],
    admin: [{type: mongoose.Schema.ObjectId, ref:'usuario'}]
})

module.exports = mongoose.model('hotel', hotelSchema)