const mongoose = require('mongoose')

const hotelSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 1,
        required: [true, 'Hotel debe tener un nombre']
    },
    reservation: [{type: mongoose.Schema.ObjectId, ref:'reservation'}],
    room : [{type: mongoose.Schema.ObjectId, ref:'room'}],
    event: [{type: mongoose.Schema.ObjectId, ref:'event'}],
    user: [{type: mongoose.Schema.ObjectId, ref:'usuario'}],
    admin: [{type: mongoose.Schema.ObjectId, ref: 'usuario'}]
})

module.exports = mongoose.model('hotel', hotelSchema)