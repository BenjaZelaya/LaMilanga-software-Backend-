const express = require("express");
const router = express.Router();
const Factura = require("../models/Factura");
const Gasto = require("../models/Gasto");

// 📌 Obtener resumen de cartera
router.get("/", async (req, res) => {
  try {
    console.log("🔍 Calculando resumen de cartera desde MongoDB...");

    // Sumar totales de facturas (ingresos)
    const facturas = await Factura.find().sort({ id: -1 });
    console.log("📋 Facturas encontradas:", facturas); // Depuración
    const ingresos = facturas.reduce((sum, f) => sum + (f.total || 0), 0);

    // Sumar totales de gastos (egresos)
    const gastos = await Gasto.find().sort({ id: -1 });
    const egresos = gastos.reduce((sum, g) => sum + (g.monto || 0), 0);

    // Calcular saldo
    const saldo = ingresos - egresos;

    // Calcular total de transferencias
    const totalTransferencias = facturas
      .filter((f) => f.metodoPago === "Transferencia")
      .reduce((sum, f) => sum + (f.total || 0), 0);

    // Calcular total de efectivo
    const totalEfectivo = facturas
      .filter((f) => f.metodoPago === "Efectivo")
      .reduce((sum, f) => sum + (f.total || 0), 0);

    // Preparar respuesta
    const resumen = {
      ingresos,
      egresos,
      saldo,
      totalTransferencias,
      totalEfectivo,
      facturas,
      gastos,
    };

    console.log("📊 Resumen calculado:", resumen); // Depuración
    res.json(resumen);
  } catch (err) {
    console.error("❌ Error al calcular resumen de cartera:", err.stack);
    res.status(500).json({ error: "Error al calcular cartera", details: err.message });
  }
});

module.exports = router;