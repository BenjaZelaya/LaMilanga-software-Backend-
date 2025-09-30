const express = require("express");
const router = express.Router();
const Factura = require("../models/Factura");

// 📌 Obtener todas las facturas
router.get("/", async (req, res) => {
  try {
    console.log("🔍 Consultando facturas en MongoDB...");
    const facturas = await Factura.find().sort({ _id: -1 });
    console.log("📊 Facturas encontradas:", facturas.length);
    if (facturas.length === 0) console.log("⚠️ No se encontraron facturas en la base de datos.");
    res.json(facturas);
  } catch (err) {
    console.error("❌ Error al leer facturas:", err.stack);
    res.status(500).json({ error: "Error al leer facturas", details: err.message });
  }
});

// 📌 Crear factura
router.post("/", async (req, res) => {
  try {
    console.log("📥 Body recibido:", req.body);
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "El cuerpo de la solicitud está vacío" });
    }

    const { cliente, turno, productos, total, metodoPago } = req.body;

    if (!cliente || !turno || !productos || productos.length === 0 || !total || !metodoPago) {
      return res
        .status(400)
        .json({ error: "Cliente, turno, productos, total y método de pago son obligatorios" });
    }

    const now = new Date();
    const fechaISO = now.toISOString().split("T")[0];
    const hora = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    console.log("🔍 Buscando última factura para ID...");
    const lastFactura = await Factura.findOne().sort({ id: -1 });
    const newId = lastFactura ? lastFactura.id + 1 : 1;
    console.log("🆕 Nuevo ID calculado:", newId);

    const nuevaFactura = new Factura({
      id: newId,
      cliente,
      turno,
      productos,
      total: Number(total),
      fecha: fechaISO,
      hora,
      metodoPago, // Guardamos el método de pago
    });

    await nuevaFactura.save();
    console.log("💾 Factura guardada exitosamente:", nuevaFactura.id);
    console.log("📄 Detalles guardados:", nuevaFactura);
    res.status(201).json({ message: "Factura guardada", factura: nuevaFactura });
  } catch (err) {
    console.error("❌ Error al guardar factura:", err.stack);
    res.status(500).json({ error: "Error al guardar factura", details: err.message });
  }
});

// 📌 Eliminar factura
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log("🗑️ Intentando eliminar factura con ID:", id);
    const result = await Factura.findOneAndDelete({ id });

    if (!result) {
      console.log("⚠️ Factura no encontrada con ID:", id);
      return res.status(404).json({ error: "Factura no encontrada" });
    }

    console.log("✅ Factura eliminada con ID:", id);
    res.json({ message: "Factura eliminada correctamente" });
  } catch (err) {
    console.error("❌ Error al eliminar factura:", err.stack);
    res.status(500).json({ error: "Error al eliminar factura", details: err.message });
  }
});

module.exports = router;