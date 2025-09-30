const mongoose = require("mongoose");

const gastoSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  nombre: { type: String, required: true },
  monto: { type: Number, required: true },
  fecha: { type: String, required: true },
  hora: { type: String },
});

module.exports = mongoose.model("Gasto", gastoSchema);