const mongoose = require("mongoose");

const habitacionSchema = new mongoose.Schema({
  disponibilidad: {
    type: String,
    required: [true, "La habitacion necesita una disponibilidad"],
  },
  services: [{ type: mongoose.Schema.ObjectId, ref: "servicio" }],
});

module.exports = mongoose.model("habitacion", habitacionSchema);
