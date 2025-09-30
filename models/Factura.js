const mongoose = require("mongoose");

const facturaSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  cliente: { type: String },
  turno: { type: String },
  productos: [{ nombre: String, cantidad: Number, precio: Number, subtotal: Number }],
  total: { type: Number, required: true },
  fecha: { type: String, required: true },
  hora: { type: String },
  metodoPago: { type: String, required: true }, // Nuevo campo
});

module.exports = mongoose.model("Factura", facturaSchema);