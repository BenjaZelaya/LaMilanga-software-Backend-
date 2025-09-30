const express = require("express");
const router = express.Router();
const Gasto = require("../models/Gasto");

// 📌 Obtener todos los gastos
router.get("/", async (req, res) => {
  try {
    console.log("🔍 Consultando gastos en MongoDB...");
    const gastos = await Gasto.find().sort({ id: -1 });
    console.log("📊 Gastos encontrados:", gastos.length);
    res.json(gastos);
  } catch (err) {
    console.error("❌ Error al leer gastos:", err.stack);
    res.status(500).json({ error: "Error al leer gastos", details: err.message });
  }
});

// 📌 Crear gasto
router.post("/", async (req, res) => {
  try {
    console.log("📥 Body recibido:", req.body);
    const { nombre, monto } = req.body;

    if (!nombre || !monto) {
      return res.status(400).json({ error: "Nombre y monto son obligatorios" });
    }

    console.log("🔍 Buscando último gasto para ID...");
    const lastGasto = await Gasto.findOne().sort({ id: -1 });
    const newId = lastGasto ? lastGasto.id + 1 : 1;
    console.log("🆕 Nuevo ID calculado:", newId);

    const nuevoGasto = new Gasto({
      id: newId,
      nombre,
      monto: Number(monto),
      fecha: new Date().toLocaleDateString("es-AR"),
      hora: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    });

    await nuevoGasto.save();
    console.log("💾 Gasto guardado exitosamente:", nuevoGasto.id);
    res.status(201).json({ message: "Gasto guardado correctamente", gasto: nuevoGasto });
  } catch (err) {
    console.error("❌ Error al guardar gasto:", err.stack);
    res.status(500).json({ error: "Error al guardar gasto", details: err.message });
  }
});

// 📌 Eliminar gasto
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log("🗑️ Intentando eliminar gasto con ID:", id);
    const result = await Gasto.findOneAndDelete({ id });

    if (!result) {
      console.log("⚠️ Gasto no encontrado con ID:", id);
      return res.status(404).json({ error: "Gasto no encontrado" });
    }

    console.log("✅ Gasto eliminado con ID:", id);
    res.json({ message: "Gasto eliminado correctamente" });
  } catch (err) {
    console.error("❌ Error al eliminar gasto:", err.stack);
    res.status(500).json({ error: "Error al eliminar gasto", details: err.message });
  }
});

module.exports = router;