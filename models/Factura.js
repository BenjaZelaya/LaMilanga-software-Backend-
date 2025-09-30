const mongoose = require("mongoose");

const productoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  cantidad: { type: Number, required: true },
  precio: { type: Number, required: true },
  subtotal: { type: Number, required: true },
});

const facturaSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  cliente: { type: String, required: true },
  turno: { type: String, required: true },
  productos: [productoSchema], // 👈 ARRAY de productos
  total: { type: Number, required: true },
  fecha: { type: String, required: true },
  hora: { type: String, required: true },
});

module.exports = mongoose.model("Factura", facturaSchema);
