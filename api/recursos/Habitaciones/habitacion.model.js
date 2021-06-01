const mongoose = require("mongoose");

const habitacionSchema = new mongoose.Schema({
  codigoHabitacion: {
    type: String,
    required: [true, "La habitacion necesita un codigo de habitacion"]
  },
  disponibilidad: {
    type: String,
    required: [true, "La habitacion necesita una disponibilidad"],
  },
  descripcion: {
    type: String,
    required: [true]
  },
  tipoHabitacion: {
    type: String,
    required: [true, "La habitacion necesita un tipo"]
  },
  precio: {
    type: Number,
    required: [true, "La habitacion necesita un precio"]
  }
});

module.exports = mongoose.model("habitacion", habitacionSchema);
