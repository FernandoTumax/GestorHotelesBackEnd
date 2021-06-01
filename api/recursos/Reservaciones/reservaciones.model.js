const mongoose = require("mongoose");

const reservationSchema = mongoose.Schema({
  fechaIngreso: {
    type: String,
    required: [true, "la reservacion necesita una fecha de ingreso"],
  },
  fechaSalida: {
    type: String,
    required: [true, "la reservacion necesita una fecha de salida"],
  },
  numeroTarjeta: {
    type: Number,
    min: 0,
    required: [true, "la reservacion necesita una tarjeta del usuario"],
  },
  totalPagar: {
    type: Number,
    min: 0,
    required: [true, "la reservacion necesita un total a pagar"],
  },
  room: [],
  service: [],
  hotel: {
    _id : {
      type: String,
      required: [true, "El hotel necesita un id"]
    },
    nombreHotel: {
      type: String,
      required: [true, "El hotel necesita un nombre"]
    },
    direccionHotel: {
      type: String,
      required: [true, "El hotel necesita una direccion"]
    }
  },
  client: {
    _id: {
      type: String,
      required: [true, "El hotel necesita un id"]
    },
    nombreCliente: {
      type: String,
      required: [true, "El cliente necesita un nombre"]
    },
    apellidoCliente: {
      type: String,
      required: [true, "El cliente necesita un apellido"]
    },
    emailCliente: {
      type: String,
      required: [true, "El cliente necesita un email"]
    }
  }
});

module.exports = mongoose.model("reservacion", reservationSchema);
